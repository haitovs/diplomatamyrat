import { motion } from 'framer-motion';
import { CreditCard, Banknote, Landmark, Percent } from 'lucide-react';
import { useState } from 'react';

export default function PaymentSettings() {
    const [methods, setMethods] = useState({
        cash: true,
        card: false,
        bank: false
    });
    const [taxRate, setTaxRate] = useState('0');
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

    const toggleMethod = (key: keyof typeof methods) => {
        setMethods(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6">
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm"
                >
                    ✓ Payment settings updated successfully
                </motion.div>
            )}

            {/* Payment Methods */}
            <div className="space-y-4">
                <h3 className="font-heading font-medium text-stone-900">Payment Methods</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <Banknote className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-900">Cash on Delivery</p>
                                <p className="text-sm text-stone-500">Pay when order arrives</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={methods.cash}
                                onChange={() => toggleMethod('cash')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-900">Credit Card</p>
                                <p className="text-sm text-stone-500">Processing via Stripe</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={methods.card}
                                onChange={() => toggleMethod('card')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-900">Bank Transfer</p>
                                <p className="text-sm text-stone-500">Manual wire transfer</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={methods.bank}
                                onChange={() => toggleMethod('bank')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Taxes */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Percent className="w-4 h-4" /> Tax Configuration
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Tax Rate (%)
                    </label>
                    <input
                        type="number"
                        value={taxRate}
                        onChange={e => setTaxRate(e.target.value)}
                        className="input w-32"
                        min="0"
                        max="100"
                    />
                    <p className="text-sm text-stone-500 mt-1">
                        Applied to all physical products at checkout.
                    </p>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    {saving ? 'Saving...' : 'Update Payment Settings'}
                </button>
            </div>
        </div>
    );
}
