"use client";

import { useState, useEffect } from "react";
import { NewsItem } from "@/lib/news";
import Image from "next/image";
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
import { GripVertical, Plus, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

function SortableNewsItem({ item, onEdit, onDelete, isDeleting }: { 
  item: NewsItem; 
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
      className={`bg-white rounded-lg sm:rounded-xl border border-secondary-200 p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 transition-all duration-200 relative shadow-soft ${
        isDragging ? 'shadow-large border-primary-300' : 'hover:border-primary-300 hover:shadow-medium'
      } ${isDeleting ? 'opacity-60' : ''}`}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center z-10">
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
          {item.image && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border border-secondary-200">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
                item.categoryColor === 'blue'
                  ? 'text-blue-600 bg-blue-50'
                  : item.categoryColor === 'teal'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-secondary-600 bg-secondary-50'
              }`}>
                {item.category}
              </span>
              <span className="text-[10px] sm:text-xs text-secondary-500">{item.date}</span>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-secondary-900 truncate mb-0.5 sm:mb-1">{item.title}</h3>
            <p className="text-xs sm:text-sm text-secondary-600 line-clamp-2">{item.description}</p>
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

export default function NewsManagementTab() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Institute News");
  const [categoryColor, setCategoryColor] = useState<'blue' | 'teal' | 'gray'>('blue');
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [href, setHref] = useState("/news");
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [clearImage, setClearImage] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Loading news items from /api/news...');
        const response = await fetch('/api/news');
        const data = await response.json();
        if (response.ok) {
          console.log('News items loaded:', data.length, 'items');
          console.log('News items data:', data);
          setItems(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to load news items:', response.status, data);
          setMessage(`Failed to load news items: ${data.error || data.details || 'Unknown error'}`);
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading news items:', error);
        setMessage(`Error loading news items: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setItems([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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

  const saveOrder = async () => {
    try {
      setIsSavingOrder(true);
      setProgress(0);
      setProgressMessage("Saving order...");
      
      const response = await fetch('/api/admin/news/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemIds: items.map(i => i.id) }),
      });

      if (response.ok) {
        setProgress(100);
        setProgressMessage("Order saved successfully!");
        setHasUnsavedChanges(false);
        setTimeout(() => {
          setProgress(0);
          setProgressMessage("");
          setIsSavingOrder(false);
        }, 2000);
      } else {
        throw new Error('Failed to save order');
      }
    } catch (error) {
      setProgressMessage('Error saving order');
      setTimeout(() => {
        setProgress(0);
        setProgressMessage("");
        setIsSavingOrder(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (!editingId) {
      setTitle("");
      setCategory("Institute News");
      setCategoryColor('blue');
      setDescription("");
      setDate("");
      setHref("/news");
      setImagePreview(null);
      setExistingImage(null);
      setClearImage(false);
      return;
    }
    const item = items.find((x) => x.id === editingId);
    if (item) {
      setTitle(item.title || "");
      setCategory(item.category || "Institute News");
      setCategoryColor(item.categoryColor || 'blue');
      setDescription(item.description || "");
      setDate(item.date || "");
      setHref(item.href || "/news");
      setExistingImage(item.image || null);
      setClearImage(false);
    }
  }, [editingId, items]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setClearImage(false);
    } else {
      setImagePreview(null);
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
      formData.set('category', category);
      formData.set('categoryColor', categoryColor);
      formData.set('description', description);
      formData.set('date', date);
      formData.set('href', href);

      setProgress(10);
      setProgressMessage("Compressing images...");
      
      const imageFile = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
      if (imageFile) {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          fileType: 'image/jpeg'
        });
        formData.append('image', compressedFile, compressedFile.name);
      }

      if (clearImage && editingId) {
        formData.set('clearImage', 'true');
      }

      setProgress(20);
      setProgressMessage("Uploading to server...");

      const endpoint = editingId ? `/api/admin/news/${editingId}` : "/api/admin/news";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, { 
        method, 
        body: formData,
        credentials: 'include'
      });

      setProgress(60);
      setProgressMessage("Processing...");

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save news item");
      }

      setProgress(80);
      setProgressMessage("Finalizing...");

      setMessage(editingId ? "News item updated successfully!" : "News item created successfully!");
      
      const refreshResponse = await fetch('/api/news');
      if (refreshResponse.ok) {
        const refreshed = await refreshResponse.json();
        setItems(refreshed);
      }
      
      setProgress(100);
      setProgressMessage("Complete!");
      
      if (!editingId) {
        form.reset();
        setTitle("");
        setCategory("Institute News");
        setCategoryColor('blue');
        setDescription("");
        setDate("");
        setHref("/news");
        setImagePreview(null);
        setExistingImage(null);
        setClearImage(false);
      }
      setEditingId(null);
      
      setTimeout(() => {
        setMessage(null);
        setProgress(0);
        setProgressMessage("");
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save news item";
      setMessage(errorMessage);
      setProgress(0);
      setProgressMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Create/Edit Form */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl sm:rounded-3xl border border-secondary-200 shadow-soft p-4 sm:p-6 md:p-8 grid grid-cols-1 gap-4 sm:gap-6 md:gap-8" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Title *</label>
            <input name="title" value={title} onChange={(e)=>setTitle(e.target.value)} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Date *</label>
            <input name="date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Category *</label>
            <input name="category" value={category} onChange={(e)=>setCategory(e.target.value)} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Category Color *</label>
            <select name="categoryColor" value={categoryColor} onChange={(e)=>setCategoryColor(e.target.value as 'blue' | 'teal' | 'gray')} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors">
              <option value="blue">Blue</option>
              <option value="teal">Teal</option>
              <option value="gray">Gray</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Description *</label>
          <textarea name="description" value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} required className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Link (optional)</label>
          <input name="href" value={href} onChange={(e)=>setHref(e.target.value)} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-secondary-900 placeholder-secondary-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-secondary-700 mb-1.5 sm:mb-2">Image (optional)</label>
          <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-white border border-secondary-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 sm:py-3 text-xs sm:text-sm text-secondary-900 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md sm:file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-primary-600 file:text-white hover:file:bg-primary-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors" />
          
          {editingId && existingImage && (
            <div className="mt-4">
              <p className="text-xs sm:text-sm text-secondary-700 mb-2 font-medium">Existing Image:</p>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border border-secondary-200">
                <Image src={existingImage} alt="Existing" fill className="object-cover" />
              </div>
              <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={clearImage} onChange={(e)=>setClearImage(e.target.checked)} className="rounded border-secondary-200" />
                <span className="text-xs sm:text-sm text-secondary-600">Remove image</span>
              </label>
            </div>
          )}
          
          {imagePreview && (
            <div className="mt-4">
              <p className="text-xs sm:text-sm text-secondary-700 mb-2 font-medium">New Image Preview:</p>
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden border border-secondary-200">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button type="submit" disabled={submitting} className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg sm:rounded-xl shadow-medium hover:shadow-large hover:scale-105 transition-all duration-300 w-full sm:w-auto">
            {editingId ? "Update News" : "Create News"}
          </button>
          {editingId && (
            <button type="button" onClick={() => setEditingId(null)} className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white rounded-lg sm:rounded-xl transition-all duration-300 w-full sm:w-auto">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* News Items List */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-secondary-200 overflow-hidden shadow-soft">
        <div className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-b border-secondary-100 font-medium">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-base sm:text-lg text-secondary-900">News Items</span>
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
                  {isSavingOrder ? "Saving..." : "Save Order"}
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
                <SortableNewsItem
                  key={item.id}
                  item={item}
                  onEdit={setEditingId}
                  isDeleting={deletingId === item.id}
                  onDelete={async (id) => {
                    if (!confirm('Delete this news item?')) return;
                    setDeletingId(id);
                    setMessage(null);
                    try {
                      const res = await fetch(`/api/admin/news/${id}`, { 
                        method: 'DELETE',
                        credentials: 'include'
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        setMessage(data?.error || 'Failed to delete');
                        setDeletingId(null);
                      } else {
                        setMessage('News item deleted successfully');
                        const refreshResponse = await fetch('/api/news');
                        const refreshed = refreshResponse.ok ? await refreshResponse.json() : [];
                        setItems(refreshed);
                        setHasUnsavedChanges(false);
                        setDeletingId(null);
                      }
                      setTimeout(() => setMessage(null), 3000);
                    } catch (error) {
                      setMessage('Failed to delete news item');
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
              <p className="text-lg mb-2">No news items yet.</p>
              <p className="text-sm">Create your first news item above.</p>
            </div>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl border border-primary-200 bg-primary-50 text-secondary-900">
          {message}
        </div>
      )}

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
              <h3 className="text-xl font-bold text-secondary-900 mb-2">{editingId ? 'Updating News' : 'Creating News'}</h3>
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
    </div>
  );
}

