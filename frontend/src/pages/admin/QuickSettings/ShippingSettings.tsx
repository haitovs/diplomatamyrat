import { motion } from 'framer-motion';
import { Truck, MapPin, Package } from 'lucide-react';
import { useState } from 'react';

export default function ShippingSettings() {
    const [flatRate, setFlatRate] = useState('20');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('200');
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
                    ✓ Shipping settings updated successfully
                </motion.div>
            )}

            {/* Shipping Zones */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Shipping Zones
                    </h3>
                    <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                        + Add Zone
                    </button>
                </div>

                <div className="border border-stone-200 rounded-lg divide-y divide-stone-200">
                    <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center">
                                <span className="font-bold text-xs text-stone-600">TM</span>
                            </div>
                            <div>
                                <p className="font-medium text-stone-900">Domestic (Turkmenistan)</p>
                                <p className="text-xs text-stone-500">All regions</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-stone-900">20 TMT</span>
                    </div>

                    <div className="p-3 flex items-center justify-between bg-stone-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
                                <Globe className="w-4 h-4 text-stone-500" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-900">International</p>
                                <p className="text-xs text-stone-500">Rest of world</p>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-stone-500">Not configured</span>
                    </div>
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Rates */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Standard Rates
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Flat Rate Cost (TMT)
                        </label>
                        <input
                            type="number"
                            value={flatRate}
                            onChange={e => setFlatRate(e.target.value)}
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Handling Fee (TMT)
                        </label>
                        <input
                            type="number"
                            defaultValue="0"
                            className="input w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Free Shipping */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Free Shipping
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Free Shipping Threshold (TMT)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={freeShippingThreshold}
                            onChange={e => setFreeShippingThreshold(e.target.value)}
                            className="input w-full pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">
                            ≥
                        </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">
                        Cart total must be above this amount to qualify for free shipping.
                    </p>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    {saving ? 'Saving...' : 'Update Shipping Settings'}
                </button>
            </div>
        </div>
    );
}

function Globe(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}
