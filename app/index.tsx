import React from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SiteKey } from '../src/config/sites';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
	const open = (site: SiteKey) => navigation.navigate('Browser', { site });

  return (
		<SafeAreaView style={styles.safe}>
			<View style={styles.container}>
				<Text style={styles.brand}>Unplugged Socials</Text>

				<Text style={styles.tagline}>
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
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		backgroundColor: '#0b0b0b',
	},
	container: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 72,
		gap: 20,
	},
	brand: {
		color: '#ffffff',
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
	tagline: {
		color: '#d1d1d1',
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
});


