import { motion } from 'framer-motion';
import { Edit3, Eye } from 'lucide-react';
import { useState } from 'react';

export default function EmailTemplateSettings() {
    const [activeTemplate, setActiveTemplate] = useState('order_confirmation');
    const [subject, setSubject] = useState('Order Confirmation #[order_id]');
    const [body, setBody] = useState('Thank you for your order! We are processing it now...');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const templates = {
        order_confirmation: { subject: 'Order Confirmation #[order_id]', body: 'Thank you for your order! We are processing it now...' },
        shipping_update: { subject: 'Your order #[order_id] has shipped!', body: 'Great news! Your order is on its way. Track it here...' },
        welcome_email: { subject: 'Welcome to Hearth & Home!', body: 'We are so glad you are here. Enjoy 10% off your first order...' },
    };

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value as keyof typeof templates;
        setActiveTemplate(key);
        setSubject(templates[key].subject);
        setBody(templates[key].body);
    };

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
                    ✓ Email template updated successfully
                </motion.div>
            )}

            {/* Template Selection */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                    Select Template to Edit
                </label>
                <select
                    value={activeTemplate}
                    onChange={handleTemplateChange}
                    className="input w-full"
                >
                    <option value="order_confirmation">Order Confirmation</option>
                    <option value="shipping_update">Shipping Update</option>
                    <option value="welcome_email">Welcome Email</option>
                </select>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Editor */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Subject Line
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            className="input w-full pl-9"
                        />
                        <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Email Body (HTML supported)
                    </label>
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className="input w-full h-32 font-mono text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button className="btn btn-secondary text-sm">
                    <Eye className="w-4 h-4 mr-2" /> Send Test Email
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                >
                    {saving ? 'Saving...' : 'Save Template'}
                </button>
            </div>
        </div>
    );
}
