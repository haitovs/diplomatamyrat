import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    Loader2,
    Plus,
    Star,
    Trash2,
    Upload,
    X
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import {
    deleteProductImage,
    getProductImages,
    setProductImagePrimary,
    uploadProductImages,
    type ProductImage
} from '../../api/admin';

interface ProductImageManagerProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

export default function ProductImageManager({ productId, productName, onClose }: ProductImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: images, isLoading, error: fetchError } = useQuery({
    queryKey: ['product-images', productId],
    queryFn: () => getProductImages(productId)
  });

  const uploadMutation = useMutation({
    mutationFn: (files: FileList | File[]) => uploadProductImages(productId, files),
    onSuccess: () => {
      setUploadError(null);
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.error || error.message || 'Failed to upload images');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (imageId: string) => setProductImagePrimary(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    }
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a copy of FileList as array
      const filesCopy = Array.from(files);
      console.log('Files dropped:', filesCopy.length, filesCopy.map(f => f.name));
      uploadMutation.mutate(filesCopy);
    }
  }, [uploadMutation]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create a real copy of the FileList as an array
      // FileList is a live reference and gets cleared when input.value = ''
      const filesCopy = Array.from(files);
      console.log('Files selected:', filesCopy.length, filesCopy.map(f => f.name));
      uploadMutation.mutate(filesCopy);
    }
    // Reset input AFTER copying files
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageUrl = (url: string) => {
    // Handle both relative and absolute URLs
    if (url.startsWith('http')) return url;
    return url;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Manage Images</h3>
            <p className="text-sm text-stone-500 mt-1">{productName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {uploadMutation.isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-stone-600">Uploading images...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-stone-400" />
                </div>
                <p className="text-stone-600 mb-2">
                  Drag and drop images here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-stone-400">
                  Supports JPEG, PNG, WebP, GIF up to 5MB
                </p>
              </>
            )}
          </div>

          {/* Error Display */}
          {(uploadError || fetchError) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <strong>Error:</strong> {uploadError || (fetchError as Error)?.message || 'Something went wrong'}
            </div>
          )}

          {/* Images Grid */}
          <div className="mt-6">
            <h4 className="font-medium text-stone-800 mb-3">
              Current Images ({images?.length || 0})
            </h4>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-stone-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : images?.length === 0 ? (
              <div className="bg-stone-50 rounded-lg p-8 text-center">
                <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-stone-500">No images uploaded yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images?.map((image: ProductImage) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50"
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Primary Badge */}
                    {image.sortOrder === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Primary
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {image.sortOrder !== 0 && (
                        <button
                          onClick={() => setPrimaryMutation.mutate(image.id)}
                          disabled={setPrimaryMutation.isPending}
                          className="p-2 bg-white rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Set as primary"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this image?')) {
                            deleteMutation.mutate(image.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-primary-400 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-primary-600"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm font-medium">Add More</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-100 flex justify-end">
          <button onClick={onClose} className="btn btn-primary btn-md">
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
