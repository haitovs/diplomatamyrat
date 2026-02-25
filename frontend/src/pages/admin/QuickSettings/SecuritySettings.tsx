import { motion } from 'framer-motion';
import { Lock, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';

export default function SecuritySettings() {
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [twoFactor, setTwoFactor] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setPasswordForm({ current: '', new: '', confirm: '' });
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
                    ✓ Security settings updated successfully
                </motion.div>
            )}

            {/* Password Change */}
            <div className="space-y-4">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Change Password
                </h3>
                <div className="space-y-3">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordForm.current}
                        onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="input w-full"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwordForm.new}
                        onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        className="input w-full"
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="input w-full"
                    />
                </div>
            </div>

            <div className="h-px bg-stone-100" />

            {/* 2FA */}
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-stone-500">Secure your account with 2FA</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={e => setTwoFactor(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Session Timeout */}
            <div className="space-y-3">
                <h3 className="font-heading font-medium text-stone-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Session Security
                </h3>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                        Session Timeout
                    </label>
                    <select
                        value={sessionTimeout}
                        onChange={e => setSessionTimeout(e.target.value)}
                        className="input w-full"
                    >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="240">4 hours</option>
                        <option value="0">Never</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    {saving ? 'Saving...' : 'Update Security Settings'}
                </button>
            </div>
        </div>
    );
}
