import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Platform, Modal, Pressable, Switch, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SiteKey } from '../src/config/sites';
import { useTheme } from '../src/contexts/ThemeContext';
import { landingConfig } from '../src/config/landing';
import { getPalette, themeConfig } from '../src/config/theme';
import { Ionicons, Feather } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
	const { height, width } = useWindowDimensions();
	const { theme, toggleTheme } = useTheme();
	const [settingsVisible, setSettingsVisible] = useState(false);
	const open = (site: SiteKey) => navigation.navigate('Browser', { site });

	const palette = getPalette(theme);
	const isDark = theme === 'dark';

	// Responsive type scaling
	const baseScale = useMemo(() => {
		if (width >= 720) return 1.15;
		if (width >= 400) return 1.0;
		return 0.92;
	}, [width]);

  return (
		<SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
			<View style={styles.decor}>
				<View style={[styles.glow, { backgroundColor: palette.glowPrimary, right: -60, top: -40 }]} />
				<View style={[styles.glow, { backgroundColor: palette.glowAccent, left: -80, bottom: height * 0.28 }]} />
			</View>

			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.brandRow}>
					
						<Text
							style={[
								styles.brand,
								{
									color: palette.text,
									fontSize: themeConfig.typography.display * baseScale,
								},
							]}
						>
							{landingConfig.title}
						</Text>
					</View>

					<TouchableOpacity
						style={styles.settingsButton}
						onPress={() => setSettingsVisible(true)}
						activeOpacity={0.8}
					>
						<Ionicons name="settings-outline" size={22} color={palette.text} />
					</TouchableOpacity>
				</View>

				<Text
					style={[
						styles.tagline,
						{
							color: palette.textMuted,
							fontSize: themeConfig.typography.subtitle * baseScale,
						},
					]}
				>
					{landingConfig.subtitlePrefix}
					<Text style={{ color: palette.accent, fontWeight: '700' }}>{landingConfig.subtitleAccent}</Text>
					{landingConfig.subtitleSuffix}
				</Text>

				<View style={styles.buttons}>
					{landingConfig.ctas.map((cta) => (
						<TouchableOpacity
							key={cta.label}
							style={[
								styles.ctaButton,
								{
									backgroundColor: cta.primary ? palette.primary : (isDark ? '#1c1c1c' : '#f5f5f5'),
									borderColor: cta.primary ? palette.primary : palette.border,
									width: Math.min(320, Math.max(240, width * 0.7)),
								},
							]}
							activeOpacity={0.93}
							onPress={() => open(cta.site)}
						>
							<Ionicons
								name={cta.icon as any}
								size={18}
								color={cta.primary ? palette.primaryTextOn : (isDark ? '#ffffff' : '#111111')}
								style={{ marginRight: 10 }}
							/>
							<Text
								style={[
									styles.ctaLabel,
									{
										color: cta.primary ? palette.primaryTextOn : (isDark ? '#ffffff' : '#111111'),
										fontSize: themeConfig.typography.button * baseScale,
									},
								]}
							>
								{cta.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>

			

				{landingConfig.info?.length ? (
					<View style={[styles.info, { borderColor: palette.border, backgroundColor: theme === 'dark' ? '#121212' : '#fafafa' }]}>
						{landingConfig.info.map((i) => (
							<View key={i.text} style={styles.infoItem}>
								<Ionicons name={i.icon as any} size={18} color={palette.textMuted} style={{ marginRight: 8 }} />
								<Text style={[styles.infoText, { color: palette.textMuted }]}>{i.text}</Text>
							</View>
						))}
					</View>
				) : null}
	{landingConfig.showFeatureList && (
					<View style={[styles.features, { borderColor: palette.border }]}>
						{landingConfig.features.map((f) => (
							<View key={f.text} style={styles.featureItem}>
								<Ionicons name={f.icon as any} size={18} color={palette.textMuted} style={{ marginRight: 8 }} />
								<Text style={[styles.featureText, { color: palette.textMuted }]}>{f.text}</Text>
							</View>
						))}
					</View>
				)}
				{landingConfig.disclaimer ? (
					<Text style={[styles.disclaimer, { color: palette.textMuted }]}>
						{landingConfig.disclaimer}
					</Text>
				) : null}
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={settingsVisible}
				onRequestClose={() => setSettingsVisible(false)}
			>
				<Pressable style={styles.modalBackdrop} onPress={() => setSettingsVisible(false)}>
					<Pressable style={[styles.modalContent, { backgroundColor: palette.surface }]} onPress={(e) => e.stopPropagation()}>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, { color: palette.text }]}>Settings</Text>
							<TouchableOpacity onPress={() => setSettingsVisible(false)}>
								<Ionicons name="close" size={22} color={palette.text} />
							</TouchableOpacity>
						</View>
						
						<View style={styles.settingRow}>
							<View style={styles.settingInfo}>
								<Text style={[styles.settingLabel, { color: palette.text }]}>Dark Mode</Text>
								<Text style={[styles.settingDescription, { color: palette.textMuted }]}>Toggle between light and dark theme</Text>
							</View>
							<Switch
								value={isDark}
								onValueChange={toggleTheme}
								trackColor={{ false: '#767577', true: palette.primary }}
								thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
							/>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
	},
	decor: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: 'none',
	},
	glow: {
		position: 'absolute',
		width: 260,
		height: 260,
		borderRadius: 130,
		filter: Platform.select({ web: 'blur(60px)' as any, default: undefined }),
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 64,
		gap: 18,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		position: 'relative',
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logoBadge: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		borderWidth: 1,
	},
	brand: {
		fontWeight: '800',
		letterSpacing: 0.3,
		marginBottom: 2,
		justifyContent: 'center',
		fontFamily: Platform.select({
			ios: 'Avenir-Heavy',
			android: 'sans-serif-medium',
			default: 'System',
		}),
	},
	settingsButton: {
		position: 'absolute',
		right: 0,
		top: 2,
		padding: 8,
	},
	tagline: {
		textAlign: 'center',
		lineHeight: 22,
		maxWidth: 360,
	},
	buttons: {
		marginTop: 6,
		width: '100%',
		alignItems: 'center',
		gap: 12,
	},
	ctaButton: {
		borderRadius: themeConfig.shape.radiusMd,
		paddingHorizontal: 24,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderWidth: 1,
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
	},
	ctaLabel: {
		fontWeight: '700',
	},
	features: {
		marginTop: 18,
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: themeConfig.shape.radiusLg,
		borderWidth: 1,
		width: '100%',
		maxWidth: 460,
		gap: 10,
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	featureText: {
		fontSize: themeConfig.typography.body,
	},
	info: {
		marginTop: 10,
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: themeConfig.shape.radiusLg,
		borderWidth: 1,
		width: '100%',
		maxWidth: 460,
		gap: 8,
	},
	infoItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoText: {
		fontSize: themeConfig.typography.body,
	},
	disclaimer: {
		marginTop: 10,
		textAlign: 'center',
		maxWidth: 520,
		fontSize: 12,
		opacity: 0.85,
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		paddingBottom: 40,
		minHeight: 200,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: '700',
		fontFamily: Platform.select({
			ios: 'Avenir-Heavy',
			android: 'sans-serif-medium',
			default: 'System',
		}),
	},
	settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
	},
	settingInfo: {
		flex: 1,
		marginRight: 16,
	},
	settingLabel: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 4,
	},
	settingDescription: {
		fontSize: 14,
		lineHeight: 20,
	},
});

