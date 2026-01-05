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
  theme?: 'light' | 'dark';
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
    theme = 'dark',
  } = props;

  const source = useMemo(() => ({ uri: startUrl }), [startUrl]);

  // Inject theme preference into browser - override browser's prefers-color-scheme
  const themeInjectionBefore = useMemo(() => {
    const colorScheme = theme === 'dark' ? 'dark' : 'light';
    const prefersDark = theme === 'dark';
    // Override matchMedia to control prefers-color-scheme BEFORE any page scripts run
    return `
      (function() {
        // Override window.matchMedia to control prefers-color-scheme queries
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
          if (query === '(prefers-color-scheme: dark)' || query.includes('prefers-color-scheme: dark')) {
            const mediaQueryList = originalMatchMedia.call(this, query);
            return {
              ...mediaQueryList,
              matches: ${prefersDark},
              media: query,
              addListener: function(listener) {
                mediaQueryList.addListener(listener);
              },
              removeListener: function(listener) {
                mediaQueryList.removeListener(listener);
              },
              addEventListener: function(type, listener) {
                if (mediaQueryList.addEventListener) {
                  mediaQueryList.addEventListener(type, listener);
                }
              },
              removeEventListener: function(type, listener) {
                if (mediaQueryList.removeEventListener) {
                  mediaQueryList.removeEventListener(type, listener);
                }
              },
              dispatchEvent: function(event) {
                if (mediaQueryList.dispatchEvent) {
                  return mediaQueryList.dispatchEvent(event);
                }
                return false;
              }
            };
          }
          if (query === '(prefers-color-scheme: light)' || query.includes('prefers-color-scheme: light')) {
            const mediaQueryList = originalMatchMedia.call(this, query);
            return {
              ...mediaQueryList,
              matches: ${!prefersDark},
              media: query,
              addListener: function(listener) {
                mediaQueryList.addListener(listener);
              },
              removeListener: function(listener) {
                mediaQueryList.removeListener(listener);
              },
              addEventListener: function(type, listener) {
                if (mediaQueryList.addEventListener) {
                  mediaQueryList.addEventListener(type, listener);
                }
              },
              removeEventListener: function(type, listener) {
                if (mediaQueryList.removeEventListener) {
                  mediaQueryList.removeEventListener(type, listener);
                }
              },
              dispatchEvent: function(event) {
                if (mediaQueryList.dispatchEvent) {
                  return mediaQueryList.dispatchEvent(event);
                }
                return false;
              }
            };
          }
          return originalMatchMedia.call(this, query);
        };
        
        function applyTheme() {
          if (document.head) {
            // Set color-scheme meta tag
            let meta = document.querySelector('meta[name="color-scheme"]');
            if (!meta) {
              meta = document.createElement('meta');
              meta.name = 'color-scheme';
              document.head.appendChild(meta);
            }
            meta.content = '${colorScheme}';
            
            // Set theme-color meta tag
            let themeColor = document.querySelector('meta[name="theme-color"]');
            if (!themeColor) {
              themeColor = document.createElement('meta');
              themeColor.name = 'theme-color';
              document.head.appendChild(themeColor);
            }
            themeColor.content = '${theme === 'dark' ? '#0b0b0b' : '#ffffff'}';
          }
          
          // Force color scheme on document
          if (document.documentElement) {
            document.documentElement.style.colorScheme = '${colorScheme}';
          }
          if (document.body) {
            document.body.style.colorScheme = '${colorScheme}';
          }
        }
        
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', applyTheme);
        } else {
          applyTheme();
        }
      })();
    `;
  }, [theme]);

  const themeInjectionAfter = useMemo(() => {
    const colorScheme = theme === 'dark' ? 'dark' : 'light';
    const prefersDark = theme === 'dark';
    // Injection after content loads - ensure matchMedia override persists and apply CSS
    return `
      (function() {
        // Re-apply matchMedia override in case page scripts overwrote it
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = function(query) {
          if (query === '(prefers-color-scheme: dark)' || query.includes('prefers-color-scheme: dark')) {
            const mediaQueryList = originalMatchMedia.call(this, query);
            return {
              ...mediaQueryList,
              matches: ${prefersDark},
              media: query,
              addListener: function(listener) {
                mediaQueryList.addListener(listener);
              },
              removeListener: function(listener) {
                mediaQueryList.removeListener(listener);
              },
              addEventListener: function(type, listener) {
                if (mediaQueryList.addEventListener) {
                  mediaQueryList.addEventListener(type, listener);
                }
              },
              removeEventListener: function(type, listener) {
                if (mediaQueryList.removeEventListener) {
                  mediaQueryList.removeEventListener(type, listener);
                }
              },
              dispatchEvent: function(event) {
                if (mediaQueryList.dispatchEvent) {
                  return mediaQueryList.dispatchEvent(event);
                }
                return false;
              }
            };
          }
          if (query === '(prefers-color-scheme: light)' || query.includes('prefers-color-scheme: light')) {
            const mediaQueryList = originalMatchMedia.call(this, query);
            return {
              ...mediaQueryList,
              matches: ${!prefersDark},
              media: query,
              addListener: function(listener) {
                mediaQueryList.addListener(listener);
              },
              removeListener: function(listener) {
                mediaQueryList.removeListener(listener);
              },
              addEventListener: function(type, listener) {
                if (mediaQueryList.addEventListener) {
                  mediaQueryList.addEventListener(type, listener);
                }
              },
              removeEventListener: function(type, listener) {
                if (mediaQueryList.removeEventListener) {
                  mediaQueryList.removeEventListener(type, listener);
                }
              },
              dispatchEvent: function(event) {
                if (mediaQueryList.dispatchEvent) {
                  return mediaQueryList.dispatchEvent(event);
                }
                return false;
              }
            };
          }
          return originalMatchMedia.call(this, query);
        };
        
        // Set color-scheme meta tag
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'color-scheme';
          document.head.appendChild(meta);
        }
        meta.content = '${colorScheme}';
        
        // Set theme-color meta tag
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
          themeColor = document.createElement('meta');
          themeColor.name = 'theme-color';
          document.head.appendChild(themeColor);
        }
        themeColor.content = '${theme === 'dark' ? '#0b0b0b' : '#ffffff'}';
        
        // Force color scheme on document
        document.documentElement.style.colorScheme = '${colorScheme}';
        if (document.body) {
          document.body.style.colorScheme = '${colorScheme}';
        }
      })();
    `;
  }, [theme]);

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

  // Combine theme injection with existing injections
  const combinedInjectionBefore = useMemo(() => {
    const parts = [themeInjectionBefore];
    if (injectionBefore) parts.push(injectionBefore);
    return parts.join('\n');
  }, [themeInjectionBefore, injectionBefore]);

  const combinedInjectionAfter = useMemo(() => {
    const parts = [themeInjectionAfter];
    if (injectionAfter) parts.push(injectionAfter);
    return parts.join('\n');
  }, [themeInjectionAfter, injectionAfter]);

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
      injectedJavaScriptBeforeContentLoaded={combinedInjectionBefore}
      injectedJavaScript={combinedInjectionAfter}
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


