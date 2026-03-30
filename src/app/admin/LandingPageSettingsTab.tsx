"use client";

import { useState } from "react";
import { MediaItem } from "@/lib/contentful";
import Image from "next/image";
import { Plus, X, GripVertical } from "lucide-react";
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

type HeroSlide = {
  mediaItemId: string;
  subtitle?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  slideLabel?: string;
};

type CampaignItem = {
  mediaItemId: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
};

function SortableHeroSlide({ slide, items, index, onUpdate, onRemove }: {
  slide: HeroSlide;
  items: MediaItem[];
  index: number;
  onUpdate: (index: number, slide: HeroSlide) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `hero-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mediaItem = items.find(m => m.id === slide.mediaItemId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-secondary-200 p-5 mb-4"
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary-50 rounded-lg flex-shrink-0"
        >
          <GripVertical className="w-5 h-5 text-secondary-400" />
        </div>
        
        {mediaItem?.thumbnail?.[0] && (
          <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 border border-secondary-200">
            <Image src={mediaItem.thumbnail[0]} alt={mediaItem.title} fill className="object-cover" />
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">Media Item *</label>
              <select
                value={slide.mediaItemId}
                onChange={(e) => onUpdate(index, { ...slide, mediaItemId: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
                required
              >
                <option value="">Select media item</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">Title *</label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => onUpdate(index, { ...slide, title: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={slide.subtitle || ''}
                onChange={(e) => onUpdate(index, { ...slide, subtitle: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">Slide Label</label>
              <input
                type="text"
                value={slide.slideLabel || ''}
                onChange={(e) => onUpdate(index, { ...slide, slideLabel: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">Description</label>
            <textarea
              value={slide.description || ''}
              onChange={(e) => onUpdate(index, { ...slide, description: e.target.value })}
              className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">CTA Text</label>
              <input
                type="text"
                value={slide.ctaText || ''}
                onChange={(e) => onUpdate(index, { ...slide, ctaText: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">CTA Link</label>
              <input
                type="text"
                value={slide.ctaLink || ''}
                onChange={(e) => onUpdate(index, { ...slide, ctaLink: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function SortableCampaignItem({ item, items, index, onUpdate, onRemove }: {
  item: CampaignItem;
  items: MediaItem[];
  index: number;
  onUpdate: (index: number, item: CampaignItem) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `campaign-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // null check
  if (!item) {
    return null;
  }

  const mediaItem = items.find(m => m.id === item?.mediaItemId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-secondary-200 p-4 mb-3"
    >
      <div className="flex items-center gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary-50 rounded-lg flex-shrink-0"
        >
          <GripVertical className="w-4 h-4 text-secondary-400" />
        </div>
        
        {mediaItem?.thumbnail?.[0] && (
          <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 border border-secondary-200">
            <Image src={mediaItem.thumbnail[0]} alt={mediaItem.title} fill className="object-cover" />
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">Media Item *</label>
            <select
                value={item.mediaItemId || ''}
              onChange={(e) => onUpdate(index, { ...item, mediaItemId: e.target.value })}
              className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
              required
            >
              <option value="">Select media item</option>
              {items.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">Title</label>
            <input
              type="text"
              value={item.title || ''}
              onChange={(e) => onUpdate(index, { ...item, title: e.target.value })}
              className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Campaign title"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-700 mb-1">Description</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => onUpdate(index, { ...item, description: e.target.value })}
              className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm resize-none"
              rows={3}
              placeholder="Campaign description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">CTA Text</label>
              <input
                type="text"
                value={item.ctaText || ''}
                onChange={(e) => onUpdate(index, { ...item, ctaText: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g., APPLY NOW"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary-700 mb-1">CTA Link</label>
              <input
                type="text"
                value={item.ctaLink || ''}
                onChange={(e) => onUpdate(index, { ...item, ctaLink: e.target.value })}
                className="w-full border border-secondary-200 rounded-lg px-3 py-2 text-sm"
                placeholder="e.g., /schedule"
              />
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LandingPageSettingsTab({
  items,
  heroSlides,
  campaignItems,
  onHeroSlidesChange,
  onCampaignItemsChange,
  onSave,
  saving,
}: {
  items: MediaItem[];
  heroSlides: HeroSlide[];
  campaignItems: CampaignItem[];
  onHeroSlidesChange: (slides: HeroSlide[]) => void;
  onCampaignItemsChange: (items: CampaignItem[]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHeroDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = heroSlides.findIndex((_, i) => `hero-${i}` === active.id);
      const newIndex = heroSlides.findIndex((_, i) => `hero-${i}` === over.id);
      onHeroSlidesChange(arrayMove(heroSlides, oldIndex, newIndex));
    }
  };

  const handleCampaignDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = campaignItems.findIndex((_, i) => `campaign-${i}` === active.id);
      const newIndex = campaignItems.findIndex((_, i) => `campaign-${i}` === over.id);
      onCampaignItemsChange(arrayMove(campaignItems, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Slides Section */}
      <div className="bg-white rounded-3xl border border-secondary-200 shadow-soft p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 mb-1">Hero Slider</h2>
            <p className="text-sm text-secondary-600">Configure the main hero slider images and content</p>
          </div>
          <button
            type="button"
            onClick={() => onHeroSlidesChange([...heroSlides, {
              mediaItemId: '',
              title: '',
            }])}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleHeroDragEnd}
        >
          <SortableContext
            items={heroSlides.map((_, i) => `hero-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {heroSlides.map((slide, index) => (
              <SortableHeroSlide
                key={`hero-${index}`}
                slide={slide}
                items={items}
                index={index}
                onUpdate={(idx, updated) => {
                  const newSlides = [...heroSlides];
                  newSlides[idx] = updated;
                  onHeroSlidesChange(newSlides);
                }}
                onRemove={(idx) => {
                  onHeroSlidesChange(heroSlides.filter((_, i) => i !== idx));
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        {heroSlides.length === 0 && (
          <div className="text-center py-8 text-secondary-400">
            <p className="text-sm">No hero slides yet. Click "Add Slide" to add one.</p>
          </div>
        )}
      </div>

      {/* Campaign Items Section */}
      <div className="bg-white rounded-3xl border border-secondary-200 shadow-soft p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 mb-1">Campaign Section</h2>
            <p className="text-sm text-secondary-600">Configure the campaign slider images</p>
          </div>
          <button
            type="button"
            onClick={() => onCampaignItemsChange([...campaignItems, {
              mediaItemId: '',
            }])}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCampaignDragEnd}
        >
          <SortableContext
            items={campaignItems.map((_, i) => `campaign-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {campaignItems.map((item, index) => {
              if (!item) return null;
              return (
              <SortableCampaignItem
                key={`campaign-${index}`}
                item={item}
                items={items}
                index={index}
                onUpdate={(idx, updated) => {
                  const newItems = [...campaignItems];
                  newItems[idx] = updated;
                  onCampaignItemsChange(newItems);
                }}
                onRemove={(idx) => {
                  onCampaignItemsChange(campaignItems.filter((_, i) => i !== idx));
                }}
              />
              );
            })}
          </SortableContext>
        </DndContext>

        {campaignItems.length === 0 && (
          <div className="text-center py-8 text-secondary-400">
            <p className="text-sm">No campaign items yet. Click "Add Item" to add one.</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary-lg px-8"
        >
          {saving ? 'Saving...' : 'Save Landing Page Settings'}
        </button>
      </div>
    </div>
  );
}

