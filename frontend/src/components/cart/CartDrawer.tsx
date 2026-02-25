import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';
import { formatPrice } from '../../utils/currency';
import { getImageUrl } from '../../utils/format';

export default function CartDrawer() {
  const { t } = useTranslation();
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal, getTax, getShipping, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {t('cart.title')}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{t('cart.empty')}</h3>
                  <p className="text-stone-500 text-sm mb-6">
                    {t('cart.emptyDescription')}
                  </p>
                  <Link
                    to="/products"
                    onClick={closeCart}
                    className="btn btn-primary btn-lg"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.variant || 'default'}`}
                      className="flex gap-4 p-3 bg-stone-50 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={getImageUrl(item.product.images[0].url)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/e7e5e4/78716c?text=Product';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-stone-500 text-xs mt-0.5">
                          {item.product.category?.name}
                        </p>
                        {item.variant && (
                          <p className="text-stone-500 text-xs">{item.variant}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1, item.variant)
                              }
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1, item.variant)
                              }
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-semibold text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id, item.variant)}
                          className="text-xs text-red-600 hover:text-red-700 mt-2"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t border-stone-200 p-4 bg-stone-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">{t('common.subtotal')}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">{t('common.shipping')}</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">{t('common.tax')}</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-stone-200">
                    <span>{t('common.total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-stone-500 mb-4 text-center">
                    Add {formatPrice(2625 - subtotal)} more for free shipping
                  </p>
                )}

                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn btn-primary btn-lg w-full"
                >
                  {t('common.checkout')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
