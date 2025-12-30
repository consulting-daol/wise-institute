import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// FFmpeg 인스턴스 캐싱
let ffmpegInstance: FFmpeg | null = null;
let isFFmpegLoaded = false;

// FFmpeg 초기화
async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isFFmpegLoaded) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();
  
  // FFmpeg 로드
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  isFFmpegLoaded = true;
  
  return ffmpeg;
}

// 비디오 압축 옵션
export type VideoCompressionOptions = {
  maxSizeMB?: number; // 최대 파일 크기 (MB)
  maxWidth?: number; // 최대 너비 (px)
  maxHeight?: number; // 최대 높이 (px)
  quality?: number; // 품질 (0-51, 낮을수록 고품질, 기본값: 23)
  bitrate?: string; // 비트레이트 (예: '1M', '500k')
  rotate?: number; // 회전 각도 (90, 180, 270)
};

// 비디오 파일 압축
export async function compressVideo(
  file: File,
  options: VideoCompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 50, // 기본 최대 크기 50MB
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 23,
    bitrate,
    rotate,
  } = options;

  // 회전만 하는 경우 (rotate 옵션이 있고 크기 제한이 매우 큰 경우)
  const isRotationOnly = rotate !== undefined && maxSizeMB >= 1000;
  
  // 파일이 이미 작고 회전이 필요없으면 압축하지 않음
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB <= maxSizeMB && !rotate) {
    return file;
  }

  try {
    const ffmpeg = await getFFmpeg();
    
    // 입력 파일을 FFmpeg에 쓰기
    const fileExtension = file.name.split('.').pop() || 'mp4';
    const inputFileName = `input.${fileExtension}`;
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    
    // 출력 파일명
    const outputFileName = 'output.mp4';
    
    // 비디오 필터 구성
    let videoFilter: string;
    
    // 회전이 필요한 경우
    if (rotate) {
      if (rotate === 90) {
        videoFilter = 'transpose=1';
      } else if (rotate === 180) {
        videoFilter = 'transpose=1,transpose=1';
      } else if (rotate === 270) {
        videoFilter = 'transpose=2';
      } else {
        videoFilter = `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
      }
      
      // 회전만 하는 경우가 아니면 scale 추가
      if (!isRotationOnly) {
        if (rotate === 90 || rotate === 270) {
          // 90도/270도 회전 시 가로/세로가 바뀌므로 scale도 조정
          videoFilter = `${videoFilter},scale='min(${maxHeight},iw)':'min(${maxWidth},ih)':force_original_aspect_ratio=decrease`;
        } else {
          videoFilter = `${videoFilter},scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
        }
      }
    } else {
      videoFilter = `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
    }
    
    // 압축 명령어 구성
    const args: string[] = [
      '-i', inputFileName,
      '-vf', videoFilter,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', quality.toString(),
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y', // 덮어쓰기 허용
      outputFileName,
    ];

    // 비트레이트가 지정된 경우 사용
    if (bitrate) {
      // CRF 제거하고 비트레이트 추가
      const crfIndex = args.indexOf('-crf');
      if (crfIndex !== -1) {
        args.splice(crfIndex, 2, '-b:v', bitrate);
      }
    }

    // 압축 실행
    await ffmpeg.exec(args);

    // 압축된 파일 읽기
    const data = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
    
    // File 객체로 변환
    const compressedFile = new File(
      [blob],
      file.name.replace(/\.[^.]+$/, '.mp4'),
      { type: 'video/mp4' }
    );

    // 임시 파일 정리
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    // 압축된 파일 크기 확인
    const compressedSizeMB = compressedFile.size / (1024 * 1024);
    console.log(`비디오 압축 완료: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`);

    return compressedFile;
  } catch (error) {
    console.error('비디오 압축 실패:', error);
    // 압축 실패 시 원본 파일 반환
    return file;
  }
}

// 여러 비디오 파일 압축
export async function compressVideos(
  files: File[],
  options?: VideoCompressionOptions
): Promise<File[]> {
  const compressedFiles: File[] = [];
  
  for (const file of files) {
    try {
      const compressed = await compressVideo(file, options);
      compressedFiles.push(compressed);
    } catch (error) {
      console.error(`비디오 압축 실패 (${file.name}):`, error);
      // 실패한 경우 원본 파일 사용
      compressedFiles.push(file);
    }
  }
  
  return compressedFiles;
}

