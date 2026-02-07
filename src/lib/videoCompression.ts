import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const CORE_VERSION = '0.11.5';
let ffmpegInstance: FFmpeg | null = null;
let loadedCoreVersion: string | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && loadedCoreVersion === CORE_VERSION) {
    return ffmpegInstance;
  }
  ffmpegInstance = null;
  loadedCoreVersion = null;

  const ffmpeg = new FFmpeg();
  const baseURL = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  loadedCoreVersion = CORE_VERSION;
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

/** 이 값 이하로 요청되면 비트레이트 기반 1회 압축 (4.5MB 이하) */
const STRICT_SIZE_THRESHOLD_MB = 5;
const AUDIO_BITRATE_KBPS = 96;
const SIZE_SAFETY_MARGIN = 0.9;

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const d = video.duration;
      if (typeof d === 'number' && isFinite(d) && d > 0 && d < 36000) {
        resolve(d);
      } else {
        reject(new Error('Invalid duration'));
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Could not load video metadata'));
    };
    video.src = URL.createObjectURL(file);
  });
}

function calcTargetVideoBitrateKbps(maxSizeMB: number, durationSec: number): number {
  const totalBits = maxSizeMB * 8 * 1024 * 1024 * SIZE_SAFETY_MARGIN;
  const audioBits = AUDIO_BITRATE_KBPS * 1000 * durationSec;
  const videoBits = Math.max(0, totalBits - audioBits);
  const kbps = Math.floor(videoBits / durationSec / 1000);
  return Math.max(400, Math.min(kbps, 8000));
}

async function compressVideoWithBitrate(
  file: File,
  maxSizeMB: number,
  rotate?: number
): Promise<File> {
  let durationSec = 60;
  try {
    durationSec = await getVideoDuration(file);
  } catch {
    durationSec = 60;
  }
  durationSec = Math.max(1, Math.min(durationSec, 36000));

  const videoBitrateKbps = calcTargetVideoBitrateKbps(maxSizeMB, durationSec);
  const bitrate = `${videoBitrateKbps}k`;

  const ffmpeg = await getFFmpeg();
  const fileExtension = file.name.split('.').pop() || 'mp4';
  const inputFileName = `input.${fileExtension}`;
  await ffmpeg.writeFile(inputFileName, await fetchFile(file));

  let videoFilter = `scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease`;
  if (rotate === 90) {
    videoFilter = `transpose=1,${videoFilter}`;
  } else if (rotate === 180) {
    videoFilter = `transpose=1,transpose=1,${videoFilter}`;
  } else if (rotate === 270) {
    videoFilter = `transpose=2,${videoFilter}`;
  }

  const outputFileName = 'output.mp4';
  const videoArgs = ['-threads', '2', '-i', inputFileName, '-vf', videoFilter, '-c:v', 'libx264', '-preset', 'veryfast', '-b:v', bitrate, '-movflags', '+faststart'];

  try {
    await ffmpeg.exec([...videoArgs, '-c:a', 'copy', '-y', outputFileName]);
  } catch {
    await ffmpeg.exec([...videoArgs, '-an', '-y', outputFileName]);
  }

  const data = await ffmpeg.readFile(outputFileName);
  await ffmpeg.deleteFile(inputFileName);
  await ffmpeg.deleteFile(outputFileName);

  const blob = new Blob([data as BlobPart], { type: 'video/mp4' });
  const result = new File(
    [blob],
    file.name.replace(/\.[^.]+$/, '.mp4'),
    { type: 'video/mp4' }
  );

  if (result.size < 1000) {
    throw new Error('FFmpeg produced empty or invalid output');
  }
  return result;
}

async function compressVideoWithCRF(file: File, rotate?: number): Promise<File> {
  const ffmpeg = await getFFmpeg();
  const fileExtension = file.name.split('.').pop() || 'mp4';
  const inputFileName = `input.${fileExtension}`;
  await ffmpeg.writeFile(inputFileName, await fetchFile(file));

  let videoFilter = `scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease`;
  if (rotate === 90) {
    videoFilter = `transpose=1,${videoFilter}`;
  } else if (rotate === 180) {
    videoFilter = `transpose=1,transpose=1,${videoFilter}`;
  } else if (rotate === 270) {
    videoFilter = `transpose=2,${videoFilter}`;
  }

  const outputFileName = 'output.mp4';
  const videoArgs = ['-threads', '2', '-i', inputFileName, '-vf', videoFilter, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-movflags', '+faststart'];

  try {
    await ffmpeg.exec([...videoArgs, '-c:a', 'copy', '-y', outputFileName]);
  } catch {
    await ffmpeg.exec([...videoArgs, '-an', '-y', outputFileName]);
  }

  const data = await ffmpeg.readFile(outputFileName);
  await ffmpeg.deleteFile(inputFileName);
  await ffmpeg.deleteFile(outputFileName);

  return new File(
    [new Blob([data as BlobPart], { type: 'video/mp4' })],
    file.name.replace(/\.[^.]+$/, '.mp4'),
    { type: 'video/mp4' }
  );
}

// 비디오 파일 압축
export async function compressVideo(
  file: File,
  options: VideoCompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 50,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 23,
    bitrate,
    rotate,
  } = options;

  const isRotationOnly = rotate !== undefined && maxSizeMB >= 1000;
  const fileSizeMB = file.size / (1024 * 1024);
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (fileSizeMB <= maxSizeMB && !rotate) {
    return file;
  }

  const enforceMaxSize = maxSizeMB <= STRICT_SIZE_THRESHOLD_MB;

  try {
    if (enforceMaxSize) {
      let compressed: File;
      try {
        compressed = await compressVideoWithBitrate(file, maxSizeMB, rotate);
      } catch (bitrateError) {
        console.warn('비트레이트 압축 실패, CRF 방식으로 재시도:', bitrateError);
        compressed = await compressVideoWithCRF(file, rotate);
      }
      const compressedSizeMB = (compressed.size / (1024 * 1024)).toFixed(2);
      console.log(`비디오 압축 완료: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB}MB`);
      return compressed;
    }

    const ffmpeg = await getFFmpeg();
    const fileExtension = file.name.split('.').pop() || 'mp4';
    const inputFileName = `input.${fileExtension}`;
    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    const outputFileName = 'output.mp4';
    let videoFilter: string;
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
      if (!isRotationOnly) {
        if (rotate === 90 || rotate === 270) {
          videoFilter = `${videoFilter},scale='min(${maxHeight},iw)':'min(${maxWidth},ih)':force_original_aspect_ratio=decrease`;
        } else {
          videoFilter = `${videoFilter},scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
        }
      }
    } else {
      videoFilter = `scale='min(${maxWidth},iw)':'min(${maxHeight},ih)':force_original_aspect_ratio=decrease`;
    }

    const videoArgs = [
      '-threads', '2',
      '-i', inputFileName,
      '-vf', videoFilter,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', quality.toString(),
      '-movflags', '+faststart',
    ];
    if (bitrate) {
      const crfIndex = videoArgs.indexOf('-crf');
      if (crfIndex !== -1) {
        videoArgs.splice(crfIndex, 2, '-b:v', bitrate);
      }
    }

    try {
      await ffmpeg.exec([...videoArgs, '-c:a', 'copy', '-y', outputFileName]);
    } catch {
      await ffmpeg.exec([...videoArgs, '-an', '-y', outputFileName]);
    }
    const data = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([data as BlobPart], { type: 'video/mp4' });

    const compressedFile = new File(
      [blob],
      file.name.replace(/\.[^.]+$/, '.mp4'),
      { type: 'video/mp4' }
    );

    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    const compressedSizeMB = compressedFile.size / (1024 * 1024);
    console.log(`비디오 압축 완료: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`);

    return compressedFile;
  } catch (error) {
    console.error('비디오 압축 실패:', error);
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

