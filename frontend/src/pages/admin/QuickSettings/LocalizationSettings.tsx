import { motion } from 'framer-motion';
import { Globe, Languages, Clock } from 'lucide-react';
import { useState } from 'react';

export default function LocalizationSettings() {
    const [currency, setCurrency] = useState('TMT');
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('Asia/Ashgabat');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm"
                >
                    ✓ Localization settings updated successfully
                </motion.div>
            )}

            {/* Currency */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Currency
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Store Currency
                    </label>
                    <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="input w-full"
                    >
                        <option value="TMT">Turkmen Manat (TMT)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="RUB">Russian Ruble (RUB)</option>
                    </select>
                    <p className="text-sm text-stone-500 mt-1">
                        This is the currency your products are sold in.
                    </p>
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Language */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Languages className="w-4 h-4" /> Language
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Default Language
                    </label>
                    <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="input w-full"
                    >
                        <option value="en">English</option>
                        <option value="tm">Turkmen</option>
                        <option value="ru">Russian</option>
                    </select>
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Timezone */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Timezone
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Store Timezone
                    </label>
                    <select
                        value={timezone}
                        onChange={e => setTimezone(e.target.value)}
                        className="input w-full"
                    >
                        <option value="Asia/Ashgabat">Ashgabat (UTC+5)</option>
                        <option value="UTC">UTC</option>
                        <option value="Europe/London">London (UTC+0)</option>
                        <option value="America/New_York">New York (UTC-5)</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    {saving ? 'Saving...' : 'Update Localization'}
                </button>
            </div>
        </div>
    );
}
