import React, { useMemo } from 'react';
import { Linking, Platform } from 'react-native';
import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview';

export interface SocialWebViewProps {
  startUrl: string;
  allowedHosts: string[];
  userAgent: string;
  injectionBefore?: string;
  injectionAfter?: string;
  onNavigationStateChange?: (nav: WebViewNavigation) => void;
  webviewRef?: React.RefObject<WebView>;
}

function isHostAllowed(url: string, allowedHosts: string[]): boolean {
  try {
    const { hostname } = new URL(url);
    return allowedHosts.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export default function SocialWebView(props: SocialWebViewProps) {
  const {
    startUrl,
    allowedHosts,
    userAgent,
    injectionBefore,
    injectionAfter,
    onNavigationStateChange,
    webviewRef,
  } = props;

  const source = useMemo(() => ({ uri: startUrl }), [startUrl]);

  const shouldStart: WebViewProps['onShouldStartLoadWithRequest'] = (request) => {
    // Always allow initial load
    if (request.url === 'about:blank') return true;
    // Suppress specific noisy background URL that opens externally
    if (request.url.startsWith('https://www.facebook.com/instagram/login_sync/')) {
      return false;
    }
    const allowed = isHostAllowed(request.url, allowedHosts);
    if (!allowed) {
      Linking.openURL(request.url).catch(() => {});
      return false;
    }
    return true;
  };

  return (
    <WebView
      ref={webviewRef}
      source={source}
      userAgent={userAgent}
      sharedCookiesEnabled
      thirdPartyCookiesEnabled
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={Platform.OS === 'android' ? true : undefined}
      onShouldStartLoadWithRequest={shouldStart}
      allowsInlineMediaPlayback
      allowsFullscreenVideo={false}
      injectedJavaScriptBeforeContentLoaded={injectionBefore}
      injectedJavaScript={injectionAfter}
      onNavigationStateChange={onNavigationStateChange}
      onMessage={(event) => {
        try {
          // Surface messages from injected scripts for debugging
          // eslint-disable-next-line no-console
          console.log('[WebView message]', event.nativeEvent.data);
        } catch {}
      }}
      allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
      originWhitelist={['*']}
    />
  );
}


