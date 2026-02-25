import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CreditCard, Truck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/currency';
import { getImageUrl } from '../utils/format';

const shippingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  street: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getShipping, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });

  const subtotal = getSubtotal();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="container-narrow py-16 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">{t('cart.empty')}</h1>
        <p className="text-stone-600 mb-6">{t('cart.emptyCheckout')}</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          {t('common.browseProducts')}
        </Link>
      </div>
    );
  }

  const onSubmit = async (_data: ShippingFormData) => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate order number
      const newOrderNumber = `HH-${Date.now().toString(36).toUpperCase()}`;
      setOrderNumber(newOrderNumber);
      
      // Clear cart
      clearCart();
      
      setIsProcessing(false);
      setStep('confirmation');
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="container-narrow py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent-600" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-stone-900 mb-4">
            {t('checkout.orderConfirmed')}
          </h1>
          <p className="text-lg text-stone-600 mb-2">
            {t('checkout.thankYou')}
          </p>
          <p className="text-2xl font-mono font-bold text-primary-600 mb-6">
            {orderNumber}
          </p>
          <p className="text-stone-600 mb-8">
            {t('checkout.emailConfirmation')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn btn-primary btn-lg">
              {t('common.continueShopping')}
            </Link>
            <Link to="/orders" className="btn btn-outline btn-lg">
              {t('common.viewOrders')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-narrow">
        <nav className="mb-8">
          <button
            onClick={() => step === 'payment' ? setStep('shipping') : navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-primary-600"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
          </button>
        </nav>

        <h1 className="section-title mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary-600' : 'text-accent-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'shipping' ? 'bg-primary-600 text-white' : 'bg-accent-600 text-white'
            }`}>
              {step !== 'shipping' ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="font-medium">{t('checkout.shippingStep')}</span>
          </div>
          <div className="flex-1 h-0.5 bg-stone-200" />
          <div className={`flex items-center gap-2 ${ step === 'payment' ? 'text-primary-600' : 'text-stone-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' ? 'bg-primary-600 text-white' : 'bg-stone-200 text-stone-500'
            }`}>
              2
            </div>
            <span className="font-medium">{t('checkout.paymentStep')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              {step === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-heading font-semibold">{t('checkout.shippingInfo')}</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {t('checkout.firstName')}
                      </label>
                      <input
                        {...register('firstName')}
                        className="input"
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {t('checkout.lastName')}
                      </label>
                      <input
                        {...register('lastName')}
                        className="input"
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {t('checkout.email')}
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="input"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        {t('checkout.phone')}
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="input"
                        placeholder="+993 65 123456"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Street Address
                    </label>
                    <input
                      {...register('street')}
                      className="input"
                      placeholder="123 Main Street"
                    />
                    {errors.street && (
                      <p className="text-red-600 text-sm mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        City
                      </label>
                      <input
                        {...register('city')}
                        className="input"
                        placeholder="Ashgabat"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        {...register('postalCode')}
                        className="input"
                        placeholder="744000"
                      />
                      {errors.postalCode && (
                        <p className="text-red-600 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-xl w-full mt-6">
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <h2 className="text-xl font-heading font-semibold">Payment Method</h2>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                    <p className="text-sm text-stone-600 mb-4">
                      This is a demo checkout. No real payment will be processed.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder="4242 4242 4242 4242"
                          defaultValue="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="12/25"
                            defaultValue="12/25"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="123"
                            defaultValue="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary btn-xl w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-stone-50 rounded-xl p-6 sticky top-24">
              <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={getImageUrl(item.product.images?.[0]?.url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">{t('common.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">{t('common.shipping')}</span>
                  <span>{shipping === 0 ? t('cart.title') : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">{t('common.tax')}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-stone-200">
                  <span>{t('common.total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
