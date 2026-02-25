import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

function SortableImage({
  image,
  onDelete,
  onSetPrimary,
}: {
  image: ProductImage;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border-2 border-stone-200 hover:border-blue-400 transition-all bg-white"
    >
      <div className="aspect-video relative">
        <img
          src={image.url}
          alt={image.alt || 'Product image'}
          className="w-full h-full object-cover"
        />

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 bg-white/90 p-1.5 rounded cursor-move shadow-sm hover:bg-white transition-colors"
        >
          <GripVertical className="w-4 h-4 text-stone-600" />
        </div>

        {/* Primary Badge */}
        {image.isPrimary && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Primary</span>
          </div>
        )}

        {/* Actions - Show on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {!image.isPrimary && (
              <button
                onClick={() => onSetPrimary(image.id)}
                className="flex-1 bg-blue-600 text-white text-xs py-1.5 px-2 rounded hover:bg-blue-700 transition-colors"
              >
                Set Primary
              </button>
            )}
            <button
              onClick={() => onDelete(image.id)}
              className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageUploader({
  productId,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploading(true);

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('images', file);
      });

      try {
        const response = await fetch(
          `/api/upload/products/${productId}/images/batch`,
          {
            method: 'POST',
            body: formData,
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const newImages = await response.json();
        onImagesChange([...images, ...newImages]);
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUploading(false);
      }
    },
    [productId, images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    multiple: true,
    maxFiles: 10,
    disabled: uploading,
  });

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    const newImages = arrayMove(images, oldIndex, newIndex).map(
      (img, index) => ({
        ...img,
        sortOrder: index,
      })
    );

    onImagesChange(newImages);

    // Update on server
    try {
      await Promise.all(
        newImages.map((img) =>
          fetch(`/api/upload/images/${img.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ sortOrder: img.sortOrder }),
          })
        )
      );
    } catch (error) {
      console.error('Failed to update sort order:', error);
    }
  };

  // Delete image
  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const response = await fetch(`/api/upload/images/${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Delete failed');

      onImagesChange(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete image');
    }
  };

  // Set primary image
  const handleSetPrimary = async (imageId: string) => {
    try {
      const response = await fetch(
        `/api/upload/products/${productId}/images/${imageId}/primary`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to set primary');

      onImagesChange(
        images.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
    } catch (error) {
      console.error('Failed to set primary:', error);
      alert('Failed to set primary image');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : uploading
            ? 'border-stone-200 bg-stone-50 cursor-not-allowed'
            : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            isDragActive ? 'text-blue-600' : 'text-stone-400'
          }`}
        />
        {uploading ? (
          <p className="text-stone-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-600 font-medium">Drop images here...</p>
        ) : (
          <div>
            <p className="text-stone-600 mb-2">
              <span className="font-semibold text-blue-600">
                Click to browse
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-sm text-stone-500">
              PNG, JPG, WebP, GIF up to 5MB (max 10 images)
            </p>
          </div>
        )}
      </div>

      {/* Image Grid with Drag-Drop */}
      {images.length > 0 && (
        <div>
          <p className="text-sm text-stone-600 mb-3">
            <span className="font-medium">{images.length}</span> image
            {images.length !== 1 ? 's' : ''} • Drag to reorder • First image is
            the thumbnail
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onDelete={handleDelete}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
