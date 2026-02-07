"use client";

import { useEffect, useState } from "react";
import { MediaItem } from "@/lib/contentful";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, LogOut, Lock, Home, Settings, X, Plus, Newspaper, RotateCw } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { compressVideos, compressVideo } from '@/lib/videoCompression';
import { rotateImage } from '@/lib/imageRotation';
import NewsManagementTab from './NewsManagementTab';

// 드래그 가능한 미디어 아이템 컴포넌트
function SortableMediaItem({ item, onEdit, onDelete, isDeleting }: { 
  item: MediaItem; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl border border-secondary-200 p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 transition-all duration-200 relative shadow-soft ${
        isDragging ? 'shadow-large border-primary-300' : 'hover:border-primary-300 hover:shadow-medium'
      } ${isDeleting ? 'opacity-60' : ''}`}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-primary-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium text-secondary-700">Deleting...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1.5 sm:p-2 hover:bg-secondary-50 rounded-lg flex-shrink-0 transition-colors self-start ${isDeleting ? 'pointer-events-none' : ''}`}
        >
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-400" />
        </div>
        
        <div className="flex-1 flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 w-full sm:w-auto">
          {/* Show thumbnail or video with thumbnail as poster */}
          {(item.thumbnail && item.thumbnail.length > 0) || (item.videos && item.videos.length > 0) ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-secondary-200 bg-secondary-100">
              {item.videos && item.videos.length > 0 ? (
                <video
                  src={item.videos[0]}
                  poster={item.thumbnail && item.thumbnail.length > 0 ? item.thumbnail[0] : undefined}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                  loop
                  onMouseEnter={(e) => {
                    e.currentTarget.play().catch(() => {
                      // Autoplay failed, ignore
                    })
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause()
                    e.currentTarget.currentTime = 0
                  }}
                />
              ) : (
              <Image
                src={item.thumbnail[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
              )}
              {/* Video indicator */}
              {item.videos && item.videos.length > 0 && (
                <div className="absolute top-1 right-1 bg-primary-600/90 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold text-white">
                  Video
            </div>
          )}
            </div>
          ) : null}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-secondary-900 truncate mb-0.5 sm:mb-1">{item.title}</h3>
            {item.category && (
              <p className="text-xs sm:text-sm text-primary-600 capitalize mb-0.5 sm:mb-1">{item.category}</p>
            )}
            {item.description && (
              <p className="text-[10px] sm:text-xs text-secondary-500 line-clamp-2 sm:truncate">{item.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onEdit(item.id)}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed relative font-medium"
          >
            {isDeleting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </span>
            )}
            <span className={isDeleting ? 'opacity-0' : ''}>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'media' | 'news'>('media');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [thumbnailPreviews, setThumbnailPreviews] = useState<string[]>([]);
  const [existingThumbnails, setExistingThumbnails] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [deletedExistingImages, setDeletedExistingImages] = useState<string[]>([]);
  
  // 회전된 파일 저장 (원본 파일을 키로 사용)
  const [rotatedThumbFiles, setRotatedThumbFiles] = useState<Map<File, File>>(new Map());
  const [rotatedImageFiles, setRotatedImageFiles] = useState<Map<File, File>>(new Map());
  const [rotatedVideoFiles, setRotatedVideoFiles] = useState<Map<File, File>>(new Map());
  
  // 선택된 파일 저장
  const [selectedThumbFiles, setSelectedThumbFiles] = useState<File[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<File[]>([]);
  
  // 이미지 미리보기 URL
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Loading media items from /api/media...');
        const response = await fetch('/api/media');
          const data = await response.json();
        if (response.ok) {
          console.log('Media items loaded:', data.length, 'items');
          console.log('Media items data:', data);
          setItems(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to load media items:', response.status, data);
          setMessage(`Failed to load media items: ${data.error || data.details || 'Unknown error'}`);
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading media items:', error);
        setMessage(`Error loading media items: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setItems([]);
      }
    };
    load();
  }, []);


  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      thumbnailPreviews.forEach(url => URL.revokeObjectURL(url));
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      videoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnailPreviews, imagePreviewUrls, videoPreviewUrls]);

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      setHasUnsavedChanges(true);
    }
  };

  // 순서 저장 함수
  const saveOrder = async () => {
    try {
      setIsSavingOrder(true);
      setProgress(0);
      setCurrentProgress(0);
      setProgressMessage("Preparing to save...");
      
      const progressInterval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev < 90) {
            const increment = Math.random() * 3 + 1;
            const newProgress = Math.min(prev + increment, 90);
            
            if (newProgress < 20) {
              setProgressMessage("Connecting to server...");
            } else if (newProgress < 40) {
              setProgressMessage("Backing up current order...");
            } else if (newProgress < 60) {
              setProgressMessage("Updating media order...");
            } else if (newProgress < 80) {
              setProgressMessage("Publishing changes...");
            } else {
              setProgressMessage("Finalizing changes...");
            }
            
            setProgress(newProgress);
            return newProgress;
          }
          return prev;
        });
      }, 200);
      
      const response = await fetch('/api/admin/media/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          itemIds: items.map(i => i.id)
        }),
      });

      clearInterval(progressInterval);

      if (response.ok) {
        setProgress(100);
        setCurrentProgress(100);
        setProgressMessage("Media order saved successfully!");
        setHasUnsavedChanges(false);
        setTimeout(() => {
          setProgress(0);
          setCurrentProgress(0);
          setProgressMessage("");
          setIsSavingOrder(false);
        }, 2000);
      } else {
        const responseText = await response.text();
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
        }
        
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        } else {
          throw new Error(errorData?.error || `HTTP ${response.status}: Failed to save order`);
        }
      }
    } catch (error) {
      console.error('Error saving media order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save media order';
      
      if (errorMessage.includes('Session expired') || errorMessage.includes('Authentication failed')) {
        setProgressMessage('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login?callbackUrl=/admin';
        }, 2000);
      } else {
        setProgressMessage(`Error: ${errorMessage}`);
        setTimeout(() => {
          setProgress(0);
          setCurrentProgress(0);
          setProgressMessage("");
          setIsSavingOrder(false);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (!editingId) {
      setTitle("");
      setCategory("");
      setDescription("");
      setThumbnailPreviews([]);
      setExistingThumbnails([]);
      setExistingImages([]);
      setExistingVideos([]);
      setDeletedExistingImages([]);
      setRotatedThumbFiles(new Map());
      setRotatedImageFiles(new Map());
      setRotatedVideoFiles(new Map());
      setSelectedThumbFiles([]);
      setSelectedImageFiles([]);
      setSelectedVideoFiles([]);
      // 미리보기 URL 정리
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      videoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setImagePreviewUrls([]);
      setVideoPreviewUrls([]);
      return;
    }
    const item = items.find((x) => x.id === editingId);
    if (item) {
      setTitle(item.title || "");
      setCategory(item.category || "");
      setDescription(item.description || "");
      setExistingThumbnails(item.thumbnail || []);
      setExistingImages(item.images || []);
      setExistingVideos(item.videos || []);
      setDeletedExistingImages([]);
    }
  }, [editingId, items]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const limitedFiles = files.slice(0, 2);
      setSelectedThumbFiles(limitedFiles);
      const previews = limitedFiles.map(file => {
        const rotated = rotatedThumbFiles.get(file);
        return URL.createObjectURL(rotated || file);
      });
      setThumbnailPreviews(previews);
    } else {
      setSelectedThumbFiles([]);
      setThumbnailPreviews([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImageFiles(files);
    // 미리보기 URL 생성
    const urls = files.map(file => {
      const rotated = rotatedImageFiles.get(file);
      return URL.createObjectURL(rotated || file);
    });
    setImagePreviewUrls(urls);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedVideoFiles(files);
    // 미리보기 URL 생성
    const urls = files.map(file => {
      const rotated = rotatedVideoFiles.get(file);
      return URL.createObjectURL(rotated || file);
    });
    setVideoPreviewUrls(urls);
  };
  
  // 회전된 파일이 변경되면 미리보기 URL 업데이트
  useEffect(() => {
    if (selectedImageFiles.length > 0) {
      // 기존 URL 정리
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
      const urls = selectedImageFiles.map(file => {
        const rotated = rotatedImageFiles.get(file);
        return URL.createObjectURL(rotated || file);
      });
      setImagePreviewUrls(urls);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageFiles, rotatedImageFiles.size]);
  
  useEffect(() => {
    if (selectedVideoFiles.length > 0) {
      // 기존 URL 정리
      videoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      const urls = selectedVideoFiles.map(file => {
        const rotated = rotatedVideoFiles.get(file);
        return URL.createObjectURL(rotated || file);
      });
      setVideoPreviewUrls(urls);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoFiles, rotatedVideoFiles.size]);

  const rotateThumbnail = async (index: number) => {
    const file = selectedThumbFiles[index];
    if (!file) return;
    
    try {
      const rotated = await rotateImage(file, 90);
      const newMap = new Map(rotatedThumbFiles);
      newMap.set(file, rotated);
      setRotatedThumbFiles(newMap);
      
      // 미리보기 업데이트
      const previews = [...thumbnailPreviews];
      previews[index] = URL.createObjectURL(rotated);
      setThumbnailPreviews(previews);
    } catch (error) {
      console.error('Failed to rotate thumbnail:', error);
    }
  };

  const rotateImageFile = async (index: number) => {
    const file = selectedImageFiles[index];
    if (!file) return;
    
    try {
      const rotated = await rotateImage(file, 90);
      const newMap = new Map(rotatedImageFiles);
      newMap.set(file, rotated);
      setRotatedImageFiles(newMap);
      // 미리보기는 컴포넌트에서 rotated 파일을 사용하므로 자동으로 업데이트됨
    } catch (error) {
      console.error('Failed to rotate image:', error);
      alert('이미지 회전에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const rotateVideoFile = async (index: number) => {
    const file = selectedVideoFiles[index];
    if (!file) return;
    
    try {
      // 비디오 회전은 FFmpeg를 사용하므로 시간이 걸릴 수 있음
      // 사용자에게 알림
      const rotated = await compressVideo(file, {
        maxSizeMB: 1000, // 회전만 하므로 크기 제한 없음
        maxWidth: 9999, // 크기 제한 없음
        maxHeight: 9999,
        rotate: 90,
        quality: 23,
      });
      const newMap = new Map(rotatedVideoFiles);
      newMap.set(file, rotated);
      setRotatedVideoFiles(newMap);
    } catch (error) {
      console.error('Failed to rotate video:', error);
      alert('비디오 회전에 실패했습니다. 다시 시도해주세요.');
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setProgress(0);
    setProgressMessage("");

    try {
      const form = e.currentTarget;
      const formData = new FormData();
      formData.set('title', title);
      if (category) formData.set('category', category);
      if (description) formData.set('description', description);

      setProgress(5);
      setProgressMessage("이미지 압축 중...");
      
      const thumbFiles = Array.from((form.elements.namedItem('thumbnail') as HTMLInputElement)?.files || []);
      const imageFiles = Array.from((form.elements.namedItem('images') as HTMLInputElement)?.files || []);
      const videoFiles = Array.from((form.elements.namedItem('videos') as HTMLInputElement)?.files || []);
      
      // 회전된 파일이 있으면 사용, 없으면 원본 사용
      const finalThumbFiles = thumbFiles.map(file => rotatedThumbFiles.get(file) || file);
      const finalImageFiles = imageFiles.map(file => rotatedImageFiles.get(file) || file);
      const finalVideoFiles = videoFiles.map(file => rotatedVideoFiles.get(file) || file);
      
      const maxTotalSize = 4.2 * 1024 * 1024;
      const compressedThumbFiles: File[] = [];
      const compressedImageFiles: File[] = [];
      
      for (const file of finalThumbFiles) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          fileType: 'image/jpeg'
        });
        compressedThumbFiles.push(compressedFile);
      }
      
      for (const file of finalImageFiles) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          fileType: 'image/jpeg'
        });
        compressedImageFiles.push(compressedFile);
      }

      // 비디오 압축
      let compressedVideoFiles: File[] = [];
      if (finalVideoFiles.length > 0) {
        setProgressMessage("비디오 압축 중...");
        try {
          compressedVideoFiles = await compressVideos(finalVideoFiles, {
            maxSizeMB: 4.5, // Vercel 4.5MB 한도 이하로 압축
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 23,
          });
        } catch (error) {
          console.error('비디오 압축 실패:', error);
          // 압축 실패 시 원본 파일 사용
          compressedVideoFiles = finalVideoFiles;
        }
      }
      
      const allCompressedFiles = [...compressedThumbFiles, ...compressedImageFiles];
      const totalSize = allCompressedFiles.reduce((sum, file) => sum + file.size, 0);
      
      if (totalSize > maxTotalSize) {
        if (compressedThumbFiles.length === 0) {
          throw new Error("Images are too large. Please include thumbnails when uploading.");
        }
        
        const chunkSize = 3.5 * 1024 * 1024;
        const firstChunk: File[] = [];
        let firstSize = 0;
        
        for (const thumb of compressedThumbFiles) {
          if (firstSize + thumb.size <= chunkSize) {
            firstChunk.push(thumb);
            firstSize += thumb.size;
          }
        }
        
        for (const img of compressedImageFiles) {
          if (firstSize + img.size <= chunkSize) {
            firstChunk.push(img);
            firstSize += img.size;
          }
        }
        
        const remainingFiles = [
          ...compressedThumbFiles.filter(f => !firstChunk.includes(f)),
          ...compressedImageFiles.filter(f => !firstChunk.includes(f))
        ];
        
        const chunks: File[][] = [firstChunk];
        let currentChunk: File[] = [];
        let currentSize = 0;
        
        for (const file of remainingFiles) {
          if (currentSize + file.size > chunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentSize = 0;
          }
          currentChunk.push(file);
          currentSize += file.size;
        }
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
        
        const totalChunks = chunks.length;
        const firstBatch = new FormData();
        firstBatch.set('title', title);
        if (category) firstBatch.set('category', category);
        if (description) firstBatch.set('description', description);
        
        for (const chunkFile of firstChunk) {
          if (compressedThumbFiles.includes(chunkFile)) {
            firstBatch.append('thumbnail', chunkFile, chunkFile.name);
          } else {
            firstBatch.append('images', chunkFile, chunkFile.name);
          }
        }
        
        // 압축된 비디오 파일 추가
        for (const videoFile of compressedVideoFiles) {
          firstBatch.append('videos', videoFile, videoFile.name);
        }
        
        setProgress(10);
        setProgressMessage("Creating media item (Step 1)...");
        
        const firstRes = await fetch('/api/admin/media', {
          method: 'POST',
          body: firstBatch,
          credentials: 'include'
        });
        
        if (!firstRes.ok) {
          const data = await firstRes.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to create media item");
        }
        
        const itemId = (await firstRes.json()).id;
        
        setProgress(30);
        
        for (let i = 1; i < chunks.length; i++) {
          const chunk = chunks[i];
          setProgressMessage(`Uploading images (${i + 1}/${totalChunks})...`);
          
          const chunkBatch = new FormData();
          for (const chunkFile of chunk) {
            if (compressedThumbFiles.includes(chunkFile)) {
              chunkBatch.append('thumbnail', chunkFile, chunkFile.name);
            } else {
              chunkBatch.append('images', chunkFile, chunkFile.name);
            }
          }
          
          const chunkRes = await fetch(`/api/admin/media/${itemId}`, {
            method: 'PUT',
            body: chunkBatch,
            credentials: 'include'
          });
          
          if (!chunkRes.ok) {
            const data = await chunkRes.json().catch(() => ({}));
            throw new Error(data?.error || `Failed to upload chunk ${i + 1}`);
          }
          
          setProgress(30 + ((i / totalChunks) * 60));
        }
        
        setMessage("Media item uploaded in chunks successfully!");
        const refreshResponse = await fetch('/api/media');
        const refreshed = refreshResponse.ok ? await refreshResponse.json() : [];
        setItems(refreshed);
        setHasUnsavedChanges(false);
        form.reset();
        setTitle("");
        setCategory("");
        setDescription("");
        setThumbnailPreviews([]);
        setExistingThumbnails([]);
        setExistingImages([]);
        setExistingVideos([]);
        setDeletedExistingImages([]);
        setProgress(100);
        setProgressMessage("Complete!");
        
        setTimeout(() => {
          setMessage(null);
          setProgress(0);
          setProgressMessage("");
        }, 5000);
        setSubmitting(false);
        return;
      }
      
      for (const file of compressedThumbFiles) {
        formData.append('thumbnail', file, file.name);
      }
      for (const file of compressedImageFiles) {
        formData.append('images', file, file.name);
      }
      // 압축된 비디오 파일 추가
      for (const file of compressedVideoFiles) {
        formData.append('videos', file, file.name);
      }
      
      if (deletedExistingImages.length > 0) {
        formData.append('deleteImages', JSON.stringify(deletedExistingImages));
      }

      setProgress(10);
      setProgressMessage("데이터 준비 중...");

      const endpoint = editingId ? `/api/admin/media/${editingId}` : "/api/admin/media";
      const method = editingId ? "PUT" : "POST";
      
      setProgress(20);
      setProgressMessage("서버로 전송 중...");

      const res = await fetch(endpoint, { 
        method, 
        body: formData,
        credentials: 'include'
      });

      setProgress(60);
      setProgressMessage("Processing...");

      if (!res.ok) {
        const text = await res.text();
        let errorMessage = "Failed to create media item";
        try {
          const data = JSON.parse(text);
          errorMessage = data?.error || errorMessage;
        } catch {
          errorMessage = `Server error (${res.status}): ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setProgress(80);
      setProgressMessage("Finalizing...");

      setMessage(editingId ? "Media item updated successfully!" : "Media item created successfully!");
      
      const refreshResponse = await fetch('/api/media');
      if (refreshResponse.ok) {
        const refreshed = await refreshResponse.json();
        setItems(refreshed);
      }
      setHasUnsavedChanges(false);
      
      setProgress(100);
      setProgressMessage("Complete!");
      
      if (!editingId) {
        form.reset();
        setTitle("");
        setCategory("");
        setDescription("");
        setThumbnailPreviews([]);
        setExistingThumbnails([]);
        setExistingImages([]);
        setExistingVideos([]);
        setDeletedExistingImages([]);
      } else {
        setExistingThumbnails([]);
        setExistingImages([]);
        setExistingVideos([]);
        setDeletedExistingImages([]);
      }
      setEditingId(null);
      
      setTimeout(() => {
        setMessage(null);
        setProgress(0);
        setProgressMessage("");
      }, 3000);
    } catch (err: any) {
      console.error('❌ onSubmit error:', err);
      const errorMessage = err.message || "Failed to create media item";
      setMessage(errorMessage);
      setProgress(0);
      setProgressMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary-50 w-full overflow-x-hidden pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
          <div className="flex-1 min-w-0">
            <div className="w-10 sm:w-12 h-1 bg-primary-600 mb-3 sm:mb-4"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 mb-1.5 sm:mb-2">
              {activeTab === 'news' ? 'News Management' : editingId ? 'Edit Media' : 'Create Media'}
            </h1>
            <p className="text-sm sm:text-base text-secondary-600">
              {activeTab === 'news' ? 'Manage news articles and announcements' : 'Manage your WISE Institute media content'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
            <div className="hidden md:flex items-center gap-2 text-xs text-secondary-500">
              <span className="inline-block h-2 w-2 rounded-full bg-primary-600"></span>
              Auto WebP (q=100)
            </div>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 sm:gap-2"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Logout</span>
              <span className="xs:hidden">Out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 flex gap-1 sm:gap-2 border-b border-secondary-200 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            Media Management
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            News
          </button>
        </div>

        {message && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-primary-200 bg-primary-50 text-sm sm:text-base text-secondary-900">
            {message}
          </div>
        )}

        {/* News Management */}
        {activeTab === 'news' && (
          <NewsManagementTab />
        )}

        {/* Media Management */}
        {activeTab === 'media' && (
          <>
        <form onSubmit={onSubmit} className="bg-white rounded-2xl sm:rounded-3xl border border-secondary-200 shadow-soft p-4 sm:p-6 md:p-8 grid grid-cols-1 gap-4 sm:gap-6 md:gap-8" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Title *</label>
              <input name="title" value={title} onChange={(e)=>setTitle(e.target.value)} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Category (optional)</label>
              <input name="category" value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Description (optional)</label>
            <textarea name="description" value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">
                Thumbnails (auto-compressed to max 2MB each)
              </label>
              <input 
                name="thumbnail" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleThumbnailChange}
                className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 sm:py-3 text-xs sm:text-sm text-secondary-900 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" 
              />
              
              {editingId && existingThumbnails.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">Existing Thumbnails:</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {existingThumbnails.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-secondary-200">
                        <Image src={src} alt={`Existing ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {thumbnailPreviews.length >= 2 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">New Thumbnails:</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {thumbnailPreviews.slice(0, 2).map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-secondary-200">
                        <Image src={src} alt={`New ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {thumbnailPreviews.length === 1 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">New Thumbnail:</p>
                  <div className="relative aspect-square w-full max-w-xs sm:max-w-sm rounded-lg sm:rounded-xl overflow-hidden border border-secondary-200">
                    <Image src={thumbnailPreviews[0]} alt="New thumbnail" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">
                Images (multiple, auto-compressed to max 2MB each)
              </label>
              <input name="images" type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 sm:py-3 text-xs sm:text-sm text-secondary-900 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
              
              {selectedImageFiles.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">New Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {selectedImageFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-secondary-200 group">
                        {imagePreviewUrls[idx] && (
                          <Image src={imagePreviewUrls[idx]} alt={`Image ${idx + 1}`} fill className="object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => rotateImageFile(idx)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-4 h-4 text-secondary-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {editingId && existingImages.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">Existing Images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {existingImages
                      .filter(img => !deletedExistingImages.includes(img))
                      .filter(img => !existingThumbnails.includes(img)) // Remove duplicates with thumbnails
                      .map((src, idx) => (
                      <div key={idx} className="relative group">
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-secondary-200">
                          <Image src={src} alt={`Project Image ${idx + 1}`} fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeletedExistingImages([...deletedExistingImages, src])}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          aria-label="Delete image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {deletedExistingImages.length > 0 && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                  <p className="text-xs sm:text-sm text-red-700 mb-1.5 sm:mb-2">Images to be deleted: {deletedExistingImages.length}</p>
                  <button
                    type="button"
                    onClick={() => setDeletedExistingImages([])}
                    className="text-[10px] sm:text-xs text-red-600 hover:text-red-700 underline"
                  >
                    Undo deletion
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">
              Videos (optional)
            </label>
            <input name="videos" type="file" accept="video/*" multiple onChange={handleVideoChange} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 sm:py-3 text-xs sm:text-sm text-secondary-900 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
            
            {selectedVideoFiles.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">New Videos:</p>
                <div className="space-y-2 sm:space-y-3">
                  {selectedVideoFiles.map((file, idx) => {
                    const rotated = rotatedVideoFiles.get(file);
                    return (
                      <div key={idx} className="relative p-3 bg-secondary-50 rounded-lg border border-secondary-200 group">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-secondary-600 truncate flex-1">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => rotateVideoFile(idx)}
                            className="ml-3 bg-white hover:bg-secondary-50 border border-secondary-200 rounded-lg p-2 shadow-sm transition-colors"
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-4 h-4 text-secondary-700" />
                          </button>
                        </div>
                        {rotated && (
                          <p className="text-xs text-primary-600 mt-1">✓ Rotated</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {editingId && existingVideos.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm text-secondary-700 mb-2 sm:mb-3 font-medium">Existing Videos:</p>
                <div className="space-y-2">
                  {existingVideos.map((src, idx) => (
                    <div key={idx} className="p-2.5 sm:p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                      <p className="text-xs sm:text-sm text-secondary-600 truncate">{src}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button type="submit" disabled={submitting} className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg sm:rounded-xl shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 w-full sm:w-auto">
              {editingId ? "Update Media" : "Create Media"}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 w-full sm:w-auto">
                Cancel Edit
              </button>
            )}
            <p className="text-[10px] sm:text-xs md:text-sm text-secondary-500 text-center sm:text-left sm:ml-auto">
              Images are auto-converted to WebP (q=100).
            </p>
          </div>
        </form>

        <div className="mt-8 md:mt-10 bg-white rounded-3xl border border-secondary-200 overflow-hidden shadow-soft">
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-secondary-100 font-medium">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-base sm:text-lg text-secondary-900">Media Items</span>
                <span className="hidden sm:inline text-secondary-500">(Drag to reorder)</span>
                {hasUnsavedChanges && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    Unsaved changes
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {hasUnsavedChanges && (
                  <button
                    onClick={saveOrder}
                    disabled={isSavingOrder}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {isSavingOrder ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span className="hidden sm:inline">Saving...</span>
                      </span>
                    ) : (
                      "Save Order"
                    )}
                  </button>
                )}
                <span className="text-xs sm:text-sm text-secondary-500 ml-auto sm:ml-0">{items.length} item{items.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 md:p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableMediaItem
                    key={item.id}
                    item={item}
                    onEdit={setEditingId}
                    isDeleting={deletingId === item.id}
                    onDelete={async (id) => {
                      const isProduction = process.env.NODE_ENV === 'production';
                      const confirmMessage = isProduction 
                        ? '⚠️ PRODUCTION ENVIRONMENT: Are you absolutely sure you want to delete this media item? This action cannot be undone!'
                        : 'Delete this media item?';
                      
                      if (!confirm(confirmMessage)) return;
                      
                      setDeletingId(id);
                      setMessage(null);
                      
                      try {
                        const res = await fetch(`/api/admin/media/${id}`, { 
                          method: 'DELETE',
                          credentials: 'include'
                        });
                        
                        if (!res.ok) {
                          const data = await res.json().catch(() => ({}));
                          setMessage(data?.error || 'Failed to delete');
                          setDeletingId(null);
                        } else {
                          setMessage('Media item deleted successfully');
                          const refreshResponse = await fetch('/api/media');
                          const refreshed = refreshResponse.ok ? await refreshResponse.json() : [];
                          setItems(refreshed);
                          setHasUnsavedChanges(false);
                          setDeletingId(null);
                        }
                        
                        setTimeout(() => setMessage(null), 3000);
                      } catch (error) {
                        console.error('Delete error:', error);
                        setMessage('Failed to delete media item');
                        setDeletingId(null);
                        setTimeout(() => setMessage(null), 3000);
                      }
                    }}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            {items.length === 0 && (
              <div className="text-center py-12 text-secondary-400">
                <p className="text-lg mb-2">No media items yet.</p>
                <p className="text-sm">Create your first media item above.</p>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Create/Update 로딩 모달 */}
      {submitting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-secondary-200 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <svg className="animate-spin h-10 w-10 text-primary-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">{editingId ? 'Updating Media' : 'Creating Media'}</h3>
              <p className="text-sm text-secondary-600 mb-6">{progressMessage}</p>
              <div className="w-full bg-secondary-100 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500">{progress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Order 로딩 모달 */}
      {isSavingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-secondary-200 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6">
                <svg className="animate-spin h-10 w-10 text-primary-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Saving Media Order</h3>
              <p className="text-sm text-secondary-600 mb-6">{progressMessage}</p>
              <div className="w-full bg-secondary-100 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-secondary-500">{progress}%</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

