import React, { useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import SocialWebView from '../src/components/SocialWebView';
import Toolbar from '../src/ui/Toolbar';
import { sites, resolveUserAgentFor, SiteKey } from '../src/config/sites';
import { Accelerometer } from 'expo-sensors';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Browser'>;

export default function BrowserScreen({ route, navigation }: Props) {
  const { site } = route.params;
  const config = sites[site];
  const userAgent = resolveUserAgentFor(config);

  const webviewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);

  const onNavChange = (nav: any) => {
    setCanGoBack(nav.canGoBack);
    setCanGoForward(nav.canGoForward);
  };

  React.useEffect(() => {
    // Simple shake detection using Accelerometer magnitude
    let lastTrigger = 0;
    const debounceMs = 1000;
    const thresholdG = 1.6; // tweak as desired for sensitivity

    Accelerometer.setUpdateInterval(100);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SocialWebView
          startUrl={config.startUrl}
          allowedHosts={config.allowedHosts}
          userAgent={userAgent}
          injectionBefore={config.injectionBefore}
          injectionAfter={config.injectionAfter}
          onNavigationStateChange={onNavChange}
          webviewRef={webviewRef}
        />
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={toolbarVisible}
        onRequestClose={closeToolbar}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeToolbar}>
          <Pressable style={styles.modalCard}>
            <Toolbar
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onBack={onBack}
              onForward={onForward}
              onReload={onReload}
              onHome={onHome}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
