import React, { useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StyleSheet, View, Text, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import SocialWebView from '../src/components/SocialWebView';
import Toolbar from '../src/ui/Toolbar';
import { sites, resolveUserAgentFor, SiteKey } from '../src/config/sites';
import { Accelerometer } from 'expo-sensors';
import { useTheme } from '../src/contexts/ThemeContext';
import { appConfig } from '../src/config/app';
import ConsoleModal, { ConsoleEntry } from '../src/ui/ConsoleModal';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Browser'>;

export default function BrowserScreen({ route, navigation }: Props) {
  const { site } = route.params;
  const config = sites[site];
  const userAgent = resolveUserAgentFor(config);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const webviewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [consoleVisible, setConsoleVisible] = useState(false);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);

  const onNavChange = (nav: any) => {
    setCanGoBack(nav.canGoBack);
    setCanGoForward(nav.canGoForward);
  };

  React.useEffect(() => {
    // Simple shake detection using Accelerometer magnitude
    let lastTrigger = 0;
    const debounceMs = appConfig.shakeDebounceMs;
    const thresholdG = appConfig.shakeThresholdG;

    Accelerometer.setUpdateInterval(appConfig.accelerometerUpdateIntervalMs);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      if (magnitude > thresholdG) {
        const now = Date.now();
        if (now - lastTrigger > debounceMs) {
          lastTrigger = now;
          setToolbarVisible(true);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const closeToolbar = () => setToolbarVisible(false);

  const onBack = () => {
    webviewRef.current?.goBack();
    closeToolbar();
  };
  const onForward = () => {
    webviewRef.current?.goForward();
    closeToolbar();
  };
  const onReload = () => {
    webviewRef.current?.reload();
    closeToolbar();
  };
  const onHome = () => {
    closeToolbar();
    navigation.navigate('Home');
  };

  const onOpenConsole = () => {
    closeToolbar();
    setConsoleVisible(true);
  };

  const onConsoleEvent = (entry: ConsoleEntry) => {
    setConsoleEntries((prev) => {
      const next = [entry, ...prev];
      if (next.length > appConfig.consoleMaxEntries) {
        return next.slice(0, appConfig.consoleMaxEntries);
      }
      return next;
    });
  };

  const clearConsole = () => setConsoleEntries([]);

  return (
    <View style={{ flex: 1 ,paddingTop:insets.top,backgroundColor:theme === 'dark' ? '#1a1a1a' : '#ffffff'}}>
      <View style={{ flex: 1 }}>
        <SocialWebView
          startUrl={config.startUrl}
          allowedHosts={config.allowedHosts}
          userAgent={userAgent}
          injectionBefore={config.injectionBefore}
          injectionAfter={config.injectionAfter}
          onNavigationStateChange={onNavChange}
          webviewRef={webviewRef}
          theme={theme}
          enableConsoleBridge={appConfig.enableWebConsole}
          onConsoleEvent={appConfig.enableWebConsole ? onConsoleEvent : undefined}
        />
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={toolbarVisible}
        onRequestClose={closeToolbar}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeToolbar}>
          <Pressable
            style={[
              styles.modalCard,
              {
                maxWidth: appConfig.toolbarModalMaxWidth,
                paddingHorizontal: appConfig.toolbarModalPadding,
                paddingTop: appConfig.toolbarModalPadding,
                paddingBottom: appConfig.toolbarModalPadding,
                backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                alignSelf: 'center',
                elevation: 3,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <Toolbar
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onBack={onBack}
              onForward={onForward}
              onReload={onReload}
              onHome={onHome}
              onOpenConsole={onOpenConsole}
              showConsoleButton={appConfig.enableWebConsole}
            />
            <View style={styles.closeHint}>
              <Text style={styles.closeHintText}>Press anywhere to close</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <ConsoleModal
        visible={consoleVisible}
        onRequestClose={() => setConsoleVisible(false)}
        entries={consoleEntries}
        onClear={clearConsole}
        theme={theme}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  closeHint: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  closeHintText: {
    fontSize: 13,
    color: '#666666',
    fontFamily: '-apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
});
