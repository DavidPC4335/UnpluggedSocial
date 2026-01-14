export type ColorMode = 'light' | 'dark';

export interface ThemePalette {
	// Core
	background: string;
	surface: string;
	text: string;
	textMuted: string;
	border: string;

	// Brand
	primary: string;
	primaryTextOn: string;
	accent: string;

	// Decorative glows (use with transparency)
	glowPrimary: string;
	glowAccent: string;
}

export interface TypographyScale {
	display: number;
	title: number;
	subtitle: number;
	body: number;
	button: number;
	caption: number;
}

export interface ShapeScale {
	radiusSm: number;
	radiusMd: number;
	radiusLg: number;
}

export interface ThemeConfig {
	colors: Record<ColorMode, ThemePalette>;
	typography: TypographyScale;
	shape: ShapeScale;
	spacing: {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		xl: number;
		xxl: number;
	};
}

export const themeConfig: ThemeConfig = {
	colors: {
		dark: {
			background: '#0b0b0b',
			surface: '#141414',
			text: '#ffffff',
			textMuted: '#b5b5b5',
			border: '#272727',
			primary: '#4c6fff',
			primaryTextOn: '#ffffff',
			accent: '#e1306c',
			glowPrimary: 'rgba(76, 111, 255, 0.18)',
			glowAccent: 'rgba(225, 48, 108, 0.16)',
		},
		light: {
			background: '#ffffff',
			surface: '#ffffff',
			text: '#111111',
			textMuted: '#666666',
			border: '#e5e5e5',
			primary: '#3b5bff',
			primaryTextOn: '#ffffff',
			accent: '#c0265b',
			glowPrimary: 'rgba(59, 91, 255, 0.14)',
			glowAccent: 'rgba(192, 38, 91, 0.12)',
		},
	},
	typography: {
		display: 44,
		title: 28,
		subtitle: 16,
		body: 15,
		button: 16,
		caption: 12,
	},
	shape: {
		radiusSm: 8,
		radiusMd: 12,
		radiusLg: 20,
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		xxl: 40,
	},
};

export function getPalette(mode: ColorMode): ThemePalette {
	return themeConfig.colors[mode];
}

