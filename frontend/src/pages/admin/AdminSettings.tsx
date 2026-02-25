import { motion } from 'framer-motion';
import {
  Bell,
  CreditCard,
  Globe,
  Mail,
  Palette,
  Save,
  Shield,
  Store,
  Truck,
  Upload,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../api/client';
import { getSettings, updateSettings } from '../../api/settings';
import type { SettingsFormData } from '../../types/settings';

import SecuritySettings from './QuickSettings/SecuritySettings';
import LocalizationSettings from './QuickSettings/LocalizationSettings';
import PaymentSettings from './QuickSettings/PaymentSettings';
import ShippingSettings from './QuickSettings/ShippingSettings';
import EmailTemplateSettings from './QuickSettings/EmailTemplateSettings';

// Quick Settings Modal Component
function QuickSettingsModal({ type, onClose }: { type: string; onClose: () => void }) {
  const titles: Record<string, string> = {
    security: 'Security Settings',
    localization: 'Localization Settings',
    payments: 'Payment Settings',
    shipping: 'Shipping Settings',
    email: 'Email Templates',
  };

  const renderContent = () => {
    switch (type) {
      case 'security': return <SecuritySettings />;
      case 'localization': return <LocalizationSettings />;
      case 'payments': return <PaymentSettings />;
      case 'shipping': return <ShippingSettings />;
      case 'email': return <EmailTemplateSettings />;
      default: return null;
    }
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
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-stone-900">
            {titles[type]}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderContent()}

      </motion.div>
    </motion.div>
  );
}

export default function AdminSettings() {
  const [formData, setFormData] = useState<SettingsFormData>({
    storeName: '',
    contactEmail: '',
    contactPhone: '',
    primaryColor: '#c97654',
    logoUrl: null,
    faviconUrl: null,
    orderNotifications: true,
    lowStockAlerts: true,
    newsletterSignups: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'logo' | 'favicon' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [quickSettingsType, setQuickSettingsType] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  // Apply primary color dynamically
  useEffect(() => {
    applyPrimaryColor(formData.primaryColor);
  }, [formData.primaryColor]);

  async function loadSettings() {
    try {
      setLoading(true);
      const settings = await getSettings();
      setFormData({
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        primaryColor: settings.primaryColor,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        orderNotifications: settings.orderNotifications,
        lowStockAlerts: settings.lowStockAlerts,
        newsletterSignups: settings.newsletterSignups,
      });
      applyPrimaryColor(settings.primaryColor);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }

  function applyPrimaryColor(color: string) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Generate color shades
    const root = document.documentElement;

    // Lighter shades
    root.style.setProperty('--color-primary-50', `rgb(${Math.min(255, r + 85)} ${Math.min(255, g + 85)} ${Math.min(255, b + 85)})`);
    root.style.setProperty('--color-primary-100', `rgb(${Math.min(255, r + 70)} ${Math.min(255, g + 70)} ${Math.min(255, b + 70)})`);
    root.style.setProperty('--color-primary-200', `rgb(${Math.min(255, r + 50)} ${Math.min(255, g + 50)} ${Math.min(255, b + 50)})`);
    root.style.setProperty('--color-primary-300', `rgb(${Math.min(255, r + 30)} ${Math.min(255, g + 30)} ${Math.min(255, b + 30)})`);
    root.style.setProperty('--color-primary-400', `rgb(${Math.min(255, r + 15)} ${Math.min(255, g + 15)} ${Math.min(255, b + 15)})`);

    // Base color
    root.style.setProperty('--color-primary-500', color);
    root.style.setProperty('--color-primary-600', color);

    // Darker shades
    root.style.setProperty('--color-primary-700', `rgb(${Math.max(0, r - 30)} ${Math.max(0, g - 30)} ${Math.max(0, b - 30)})`);
    root.style.setProperty('--color-primary-800', `rgb(${Math.max(0, r - 50)} ${Math.max(0, g - 50)} ${Math.max(0, b - 50)})`);
    root.style.setProperty('--color-primary-900', `rgb(${Math.max(0, r - 70)} ${Math.max(0, g - 70)} ${Math.max(0, b - 70)})`);
  }

  async function handleImageUpload(type: 'logo' | 'favicon', file: File) {
    try {
      setUploading(type);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/upload', formData);
      const imageUrl = response.data.url;

      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'logoUrl' : 'faviconUrl']: imageUrl
      }));

      // Auto-save after upload
      setTimeout(() => handleSubmit(new Event('submit') as any), 100);
    } catch (err) {
      setError(`Failed to upload ${type}`);
      console.error(`Error uploading ${type}:`, err);
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await updateSettings(formData);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(field: keyof SettingsFormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const settingsSections = [
    {
      title: 'Store Settings',
      icon: Store,
      fields: [
        { label: 'Store Name', name: 'storeName', type: 'text', value: formData.storeName, placeholder: 'Your store name' },
        { label: 'Contact Email', name: 'contactEmail', type: 'email', value: formData.contactEmail, placeholder: 'contact@example.com' },
        { label: 'Contact Phone', name: 'contactPhone', type: 'tel', value: formData.contactPhone, placeholder: '+993 XX XXXXXX' },
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      fields: [
        { label: 'Primary Color', name: 'primaryColor', type: 'color', value: formData.primaryColor },
        { label: 'Logo', name: 'logoUrl', type: 'image', value: formData.logoUrl || '' },
        { label: 'Favicon', name: 'faviconUrl', type: 'image', value: formData.faviconUrl || '' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      fields: [
        { label: 'Order Notifications', name: 'orderNotifications', type: 'checkbox', value: formData.orderNotifications, description: 'Receive email for new orders' },
        { label: 'Low Stock Alerts', name: 'lowStockAlerts', type: 'checkbox', value: formData.lowStockAlerts, description: 'Alert when stock falls below 10' },
        { label: 'Newsletter Signups', name: 'newsletterSignups', type: 'checkbox', value: formData.newsletterSignups, description: 'Notify on new newsletter subscribers' },
      ]
    }
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-semibold text-stone-900">Settings</h1>
          <p className="text-stone-600 mt-1">Manage your store configuration</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
          >
            ✓ Settings saved successfully!
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
          >
            ✗ {error}
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-stone-100"
              >
                <div className="p-5 border-b border-stone-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-stone-600" />
                  </div>
                  <h2 className="font-heading font-semibold text-stone-900">{section.title}</h2>
                </div>
                <div className="p-5 space-y-4">
                  {section.fields.map((field) => (
                    <div key={field.label}>
                      {field.type === 'checkbox' ? (
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={(e) => handleInputChange(field.name as keyof SettingsFormData, e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <span className="font-medium text-stone-700">{field.label}</span>
                            {'description' in field && field.description && (
                              <p className="text-sm text-stone-500">{field.description}</p>
                            )}
                          </div>
                        </label>
                      ) : field.type === 'image' ? (
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            {field.label}
                          </label>
                          <div className="flex items-center gap-3">
                            {field.value && (
                              <img
                                src={field.value as string}
                                alt={field.label}
                                className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                              />
                            )}
                            <label className="btn btn-secondary btn-sm cursor-pointer">
                              <Upload className="w-4 h-4" />
                              {uploading === field.name ? 'Uploading...' : 'Upload'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploading !== null}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(
                                      field.name === 'logoUrl' ? 'logo' : 'favicon',
                                      file
                                    );
                                  }
                                }}
                              />
                            </label>
                            {field.value && (
                              <button
                                type="button"
                                onClick={() => handleInputChange(field.name as keyof SettingsFormData, '')}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            {field.label}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type={field.type}
                              value={field.value as string}
                              onChange={(e) => handleInputChange(field.name as keyof SettingsFormData, e.target.value)}
                              placeholder={'placeholder' in field ? field.placeholder : undefined}
                              className={field.type === 'color' ? 'w-20 h-10 rounded-lg border border-stone-200 cursor-pointer' : 'input'}
                            />
                            {field.type === 'color' && (
                              <span className="text-sm text-stone-600 font-mono">{field.value}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Quick Settings Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-stone-100 p-5"
          >
            <h2 className="font-heading font-semibold text-stone-900 mb-4">Quick Settings</h2>
            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Security', desc: 'Password, 2FA, sessions', type: 'security' },
                { icon: Globe, label: 'Localization', desc: 'Currency, timezone, language', type: 'localization' },
                { icon: CreditCard, label: 'Payments', desc: 'Payment methods, taxes', type: 'payments' },
                { icon: Truck, label: 'Shipping', desc: 'Zones, rates, carriers', type: 'shipping' },
                { icon: Mail, label: 'Email Templates', desc: 'Order confirmation, receipts', type: 'email' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setQuickSettingsType(item.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-700">{item.label}</p>
                    <p className="text-sm text-stone-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Quick Settings Modal */}
      {quickSettingsType && (
        <QuickSettingsModal
          type={quickSettingsType}
          onClose={() => setQuickSettingsType(null)}
        />
      )}
    </>
  );
}
