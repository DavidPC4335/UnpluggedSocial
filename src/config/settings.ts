import { SiteKey } from './sites';

/**
 * Settings Configuration
 * 
 * This file defines the structure and default values for user settings.
 * Settings are persisted using AsyncStorage and can be modified by users
 * through the settings modal.
 */

export interface PlatformVisibility {
	instagram: boolean;
	facebook: boolean;
	tiktok: boolean;
}

export interface AppSettings {
	// Platform visibility controls
	platformVisibility: PlatformVisibility;
	
	// Future settings can be added here:
	// enableNotifications: boolean;
	// autoRefresh: boolean;
	// defaultPlatform: SiteKey | null;
	// etc.
}

/**
 * Default settings that are applied when the app is first launched
 * or when settings are reset
 */
export const defaultSettings: AppSettings = {
	platformVisibility: {
		instagram: true,
		facebook: true,
		tiktok: false, // Disabled by default
	},
};

/**
 * Settings metadata for UI rendering
 */
export interface SettingOption {
	key: keyof PlatformVisibility;
	label: string;
	icon: 'logo-instagram' | 'logo-facebook' | 'logo-tiktok';
	description?: string;
}

export const platformSettings: SettingOption[] = [
	{
		key: 'instagram',
		label: 'Instagram',
		icon: 'logo-instagram',
		description: 'Show Instagram on homepage',
	},
	{
		key: 'facebook',
		label: 'Facebook',
		icon: 'logo-facebook',
		description: 'Show Facebook on homepage',
	},
	// {
	// 	key: 'tiktok',
	// 	label: 'TikTok',
	// 	icon: 'logo-tiktok',
	// 	description: 'Show TikTok on homepage',
	// },
];

/**
 * Storage key for AsyncStorage
 */
export const SETTINGS_STORAGE_KEY = '@unplugged_settings';
