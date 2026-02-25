export interface Settings {
    id: string;
    storeName: string;
    contactEmail: string;
    contactPhone: string;
    primaryColor: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    orderNotifications: boolean;
    lowStockAlerts: boolean;
    newsletterSignups: boolean;
    createdAt: string;
    updatedAt: string;
}

export type SettingsFormData = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>;
