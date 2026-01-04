import { Platform } from 'react-native';
import { instagramBefore, instagramAfter } from '../injections/instagram';
import { facebookBefore, facebookAfter } from '../injections/facebook';
import { tiktokBefore, tiktokAfter } from '../injections/tiktok';

export type SiteKey = 'instagram' | 'facebook' | 'tiktok';

export interface SiteConfig {
  displayName: string;
  startUrl: string;
  allowedHosts: string[];
  userAgentAndroid: string;
  userAgentIOS: string;
  injectionBefore: string;
  injectionAfter: string;
}

const ANDROID_MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36';
const IOS_MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export const sites: Record<SiteKey, SiteConfig> = {
  instagram: {
    displayName: 'Instagram',
    startUrl: 'https://www.instagram.com/',
    allowedHosts: ['instagram.com', 'www.instagram.com', 'l.instagram.com', 'help.instagram.com', 'static.cdninstagram.com'],
    userAgentAndroid: ANDROID_MOBILE_UA,
    userAgentIOS: IOS_MOBILE_UA,
    injectionBefore: instagramBefore,
    injectionAfter: instagramAfter,
  },
  facebook: {
    displayName: 'Facebook',
    startUrl: 'https://m.facebook.com/',
    allowedHosts: ['facebook.com', 'm.facebook.com', 'www.facebook.com', 'lm.facebook.com', 'fbcdn.net', 'fbsbx.com'],
    userAgentAndroid: ANDROID_MOBILE_UA,
    userAgentIOS: IOS_MOBILE_UA,
    injectionBefore: facebookBefore,
    injectionAfter: facebookAfter,
  },
  tiktok: {
    displayName: 'TikTok',
    startUrl: 'https://www.tiktok.com/',
    allowedHosts: ['tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'tiktokv.com', 'p16-sign.tiktokcdn-us.com', 'tiktokcdn-us.com', 'tiktokcdn.com'],
    userAgentAndroid: ANDROID_MOBILE_UA,
    userAgentIOS: IOS_MOBILE_UA,
    injectionBefore: tiktokBefore,
    injectionAfter: tiktokAfter,
  },
};

export function resolveUserAgentFor(config: SiteConfig): string {
  return Platform.OS === 'ios' ? config.userAgentIOS : config.userAgentAndroid;
}


