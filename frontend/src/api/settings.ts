import type { Settings, SettingsFormData } from '../types/settings';
import api from './client';

export async function getSettings(): Promise<Settings> {
    const response = await api.get('/api/settings');
    return response.data;
}

export async function updateSettings(data: SettingsFormData): Promise<Settings> {
    const response = await api.put('/api/settings', data);
    return response.data;
}
