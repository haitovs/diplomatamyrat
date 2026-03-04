import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Filter,
  Image as ImageIcon,
  Package,
  Plus,
  Search,
  Star,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createProduct, deleteProduct, getAdminProducts, updateProduct, type AdminProduct } from '../../api/admin';
import { getCategories } from '../../api/products';
import ProductImageManager from '../../components/admin/ProductImageManager';
import { getImageUrl } from '../../utils/format';

export default function AdminProducts() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [managingImages, setManagingImages] = useState<AdminProduct | null>(null);
  
  const queryClient = useQueryClient();
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: () => getAdminProducts({ page, limit, search })
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setShowDeleteModal(null);
    }
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-stone-900">{t('admin.products')}</h1>
          <p className="text-stone-600 mt-1">{t('admin.manageProducts')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary btn-md"
        >
          <Plus className="w-5 h-5" />
          {t('admin.addProduct')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder={t('admin.searchProducts')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input pl-10"
            />
          </div>
          <button className="btn btn-secondary btn-md">
            <Filter className="w-5 h-5" />
            {t('common.filters')}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
            ))}
          </div>
        ) : data?.products?.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">{t('admin.noProductsFound')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.product')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.sku')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.category')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.price')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.stock')}</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.status')}</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-stone-600">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data?.products?.map((product: AdminProduct) => (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0]?.url ? (
                              <img 
                                src={getImageUrl(product.images[0].url)} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-stone-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-stone-900 truncate max-w-[200px]">
                              {product.name}
                            </p>
                            {product.isFeatured && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                <Star className="w-3 h-3 fill-current" />
                                {t('admin.featuredProduct')}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-stone-600 font-mono">{product.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-sm rounded">
                          {product.category?.name || t('common.uncategorized')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-stone-900">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <span className="ml-2 text-sm text-stone-400 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-stone-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {product.isActive ? t('common.active') : t('common.draft')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                            title={t('common.view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setManagingImages(product)}
                            className="p-2 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title={t('admin.manageImages')}
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('common.edit')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowDeleteModal(product.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-stone-100">
              <p className="text-sm text-stone-600">
                {t('admin.showing')} {((page - 1) * limit) + 1} - {Math.min(page * limit, data?.total || 0)} / {data?.total} {t('admin.products').toLowerCase()}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-stone-900">{t('admin.deleteProduct')}</h3>
              <p className="text-stone-600 mt-2">
                {t('admin.confirmDeleteProduct')}
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="btn btn-secondary btn-md"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => deleteMutation.mutate(showDeleteModal)}
                  disabled={deleteMutation.isPending}
                  className="btn btn-md bg-red-600 text-white hover:bg-red-700"
                >
                  {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddModal || editingProduct) && (
          <ProductModal
            product={editingProduct}
            categories={categories || []}
            onClose={() => {
              setShowAddModal(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Image Manager Modal */}
      <AnimatePresence>
        {managingImages && (
          <ProductImageManager
            productId={managingImages.id}
            productName={managingImages.name}
            onClose={() => setManagingImages(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProductModalProps {
  product: AdminProduct | null;
  categories: any[];
  onClose: () => void;
}

function ProductModal({ product, categories, onClose }: ProductModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    sku: product?.sku || '',
    stock: product?.stock || 100,
    categoryId: product?.categoryId || '',
    badge: product?.badge || '',
    materials: product?.materials || '',
    leadTime: product?.leadTime || '',
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create product');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => updateProduct(product!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to update product');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name || !formData.slug || !formData.description || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    if (product) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAutoSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-stone-900">
            {product ? t('admin.editProduct') : t('admin.addProduct')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.name')} *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleAutoSlug}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.slug')} *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.description')} *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.price')} *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.sku')} *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.stock')}</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.category')} *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">{t('admin.selectCategory')}</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.badge')}</label>
              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                placeholder={t('admin.badgePlaceholder')}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.materials')}</label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('admin.leadTime')}</label>
              <input
                type="text"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleChange}
                placeholder={t('admin.leadTimePlaceholder')}
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-stone-700">{t('admin.featuredProduct')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-stone-700">{t('admin.activeInStore')}</span>
            </label>
          </div>
        </form>

        <div className="p-6 border-t border-stone-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button onClick={onClose} className="btn btn-secondary btn-md">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn btn-primary btn-md"
          >
            {isLoading ? (product ? t('common.saving') : t('common.creating')) : (product ? t('common.saveChanges') : t('admin.createProduct'))}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
