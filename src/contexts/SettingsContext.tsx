import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, defaultSettings, SETTINGS_STORAGE_KEY, PlatformVisibility } from '../config/settings';

interface SettingsContextType {
	settings: AppSettings;
	updatePlatformVisibility: (platform: keyof PlatformVisibility, visible: boolean) => Promise<void>;
	resetSettings: () => Promise<void>;
	isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [settings, setSettings] = useState<AppSettings>(defaultSettings);
	const [isLoading, setIsLoading] = useState(true);

	// Load settings from AsyncStorage on mount
	useEffect(() => {
		loadSettings();
	}, []);

	const loadSettings = async () => {
		try {
			const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored) as AppSettings;
				setSettings(parsed);
			}
		} catch (error) {
			console.error('Failed to load settings:', error);
			// Fall back to default settings
			setSettings(defaultSettings);
		} finally {
			setIsLoading(false);
		}
	};

	const saveSettings = async (newSettings: AppSettings) => {
		try {
			await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
			setSettings(newSettings);
		} catch (error) {
			console.error('Failed to save settings:', error);
		}
	};

	const updatePlatformVisibility = async (platform: keyof PlatformVisibility, visible: boolean) => {
		const newSettings: AppSettings = {
			...settings,
			platformVisibility: {
				...settings.platformVisibility,
				[platform]: visible,
			},
		};
		await saveSettings(newSettings);
	};

	const resetSettings = async () => {
		await saveSettings(defaultSettings);
	};

	return (
		<SettingsContext.Provider
			value={{
				settings,
				updatePlatformVisibility,
				resetSettings,
				isLoading,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error('useSettings must be used within a SettingsProvider');
	}
	return context;
}
