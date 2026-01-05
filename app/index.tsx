import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Platform, Modal, Pressable, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SiteKey } from '../src/config/sites';
import { useTheme } from '../src/contexts/ThemeContext';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
	const { theme, toggleTheme } = useTheme();
	const [settingsVisible, setSettingsVisible] = useState(false);
	const open = (site: SiteKey) => navigation.navigate('Browser', { site });

	const isDark = theme === 'dark';
	const dynamicStyles = getDynamicStyles(isDark);

  return (
		<SafeAreaView style={[styles.safe, dynamicStyles.safe]}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={[styles.brand, dynamicStyles.brand]}>Unplugged Socials</Text>
					<TouchableOpacity 
						style={styles.settingsButton} 
						onPress={() => setSettingsVisible(true)}
						activeOpacity={0.7}
					>
						<Text style={[styles.settingsIcon, dynamicStyles.settingsIcon]}>⚙️</Text>
					</TouchableOpacity>
				</View>

				<Text style={[styles.tagline, dynamicStyles.tagline]}>
					Keep your <Text style={styles.taglineAccent}>social media</Text> about being social.
				</Text>

				<TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={() => open('instagram')}>
					<Text style={styles.ctaLabel}>Open Instagram</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={() => open('instagram')}>
					<Text style={styles.ctaLabel}>Open Facebook</Text>
				</TouchableOpacity>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9} onPress={() => open('instagram')}>
            <Text style={styles.ctaLabel}>Open TikTok</Text>
          </TouchableOpacity> */}
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={settingsVisible}
				onRequestClose={() => setSettingsVisible(false)}
			>
				<Pressable style={styles.modalBackdrop} onPress={() => setSettingsVisible(false)}>
					<Pressable style={[styles.modalContent, dynamicStyles.modalContent]} onPress={(e) => e.stopPropagation()}>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>Settings</Text>
							<TouchableOpacity onPress={() => setSettingsVisible(false)}>
								<Text style={[styles.closeButton, dynamicStyles.closeButton]}>✕</Text>
							</TouchableOpacity>
						</View>
						
						<View style={styles.settingRow}>
							<View style={styles.settingInfo}>
								<Text style={[styles.settingLabel, dynamicStyles.settingLabel]}>Dark Mode</Text>
								<Text style={[styles.settingDescription, dynamicStyles.settingDescription]}>
									Toggle between light and dark theme
								</Text>
							</View>
							<Switch
								value={isDark}
								onValueChange={toggleTheme}
								trackColor={{ false: '#767577', true: '#4c6fff' }}
								thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
							/>
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		</SafeAreaView>
  );
}

function getDynamicStyles(isDark: boolean) {
	return {
		safe: {
			backgroundColor: isDark ? '#0b0b0b' : '#ffffff',
		},
		brand: {
			color: isDark ? '#ffffff' : '#0b0b0b',
		},
		tagline: {
			color: isDark ? '#d1d1d1' : '#666666',
		},
		settingsIcon: {
			color: isDark ? '#ffffff' : '#0b0b0b',
		},
		modalContent: {
			backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
		},
		modalTitle: {
			color: isDark ? '#ffffff' : '#0b0b0b',
		},
		closeButton: {
			color: isDark ? '#ffffff' : '#0b0b0b',
		},
		settingLabel: {
			color: isDark ? '#ffffff' : '#0b0b0b',
		},
		settingDescription: {
			color: isDark ? '#d1d1d1' : '#666666',
		},
	};
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 72,
		gap: 20,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		position: 'relative',
	},
	brand: {
		fontSize: 40,
		fontWeight: '800',
		letterSpacing: 0.3,
		marginBottom: 8,
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
		top: 0,
		padding: 8,
	},
	settingsIcon: {
		fontSize: 24,
	},
	tagline: {
		fontSize: 16,
		textAlign: 'center',
		lineHeight: 22,
		maxWidth: 300,
	},
	taglineAccent: {
		color: '#e1306c',
		fontWeight: '700',
	},
	ctaButton: {
		marginTop: 10,
		backgroundColor: '#4c6fff',
		borderRadius: 12,
		paddingHorizontal: 28,
		height: 48,
		alignItems: 'center',
		justifyContent: 'center',
		width: 260,
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
	},
	ctaLabel: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
	},
	secondaryRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 12,
	},
	secondaryLink: {
		color: '#9ab0ff',
		fontWeight: '600',
	},
	secondaryDivider: {
		color: '#6b7280',
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
		fontSize: 24,
		fontWeight: '700',
		fontFamily: Platform.select({
			ios: 'Avenir-Heavy',
			android: 'sans-serif-medium',
			default: 'System',
		}),
	},
	closeButton: {
		fontSize: 24,
		fontWeight: '300',
		padding: 4,
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


