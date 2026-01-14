import { SiteKey } from './sites';

export interface LandingCTA {
	label: string;
	icon: 'logo-instagram' | 'logo-facebook' | 'logo-tiktok';
	site: SiteKey;
	primary?: boolean;
}

export interface LandingConfig {
	title: string;
	subtitlePrefix: string;
	subtitleAccent: string;
	subtitleSuffix: string;
	ctas: LandingCTA[];
	showFeatureList: boolean;
	features: { icon: string; text: string }[];
	info: { icon: string; text: string }[];
    disclaimer: string;
}

export const landingConfig: LandingConfig = {
	title: 'Unplugged Socials',
	subtitlePrefix: 'Keep your ',
	subtitleAccent: 'social media',
	subtitleSuffix: ' about being social.',
	ctas: [
		{ label: 'Open Instagram', icon: 'logo-instagram', site: 'instagram', primary: true },
		// You can enable these when ready:
		// { label: 'Open Facebook', icon: 'logo-facebook', site: 'facebook' },
		// { label: 'Open TikTok', icon: 'logo-tiktok', site: 'tiktok' },
	],
	showFeatureList: true,
	features: [
		{ icon: 'people-outline', text: 'Stay connected with friends and accounts you follow' },
		{ icon: 'hourglass-outline', text: 'Be present and protect your time' },
		{ icon: 'shield-checkmark-outline', text: 'No extra ads, or retention hacking content' },
	],
    info:[
        { icon: 'information-circle-outline', text: 'Shake your phone to bring up the unplugged menu.' },
    ],
    disclaimer: 'This app is not affiliated with Instagram, Facebook, or TikTok. It is a third-party app blocker that allows you to browse these platforms.',
};

