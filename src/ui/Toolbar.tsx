import React, { useMemo } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { getPalette, themeConfig } from '../config/theme';

export interface ToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
  onOpenConsole?: () => void;
  showConsoleButton?: boolean;
}

export default function Toolbar(props: ToolbarProps) {
  const { canGoBack, canGoForward, onBack, onForward, onReload, onHome, onOpenConsole, showConsoleButton } = props;
  const { theme } = useTheme();
  const palette = getPalette(theme);

  const dynamic = useMemo(() => {
    return {
      container: {
        backgroundColor: palette.surface,
        borderTopColor: palette.border,
      },
      button: {
        backgroundColor: theme === 'dark' ? '#1b1b1b' : '#f8f9fa',
        borderColor: palette.border,
      },
      buttonPressed: {
        backgroundColor: theme === 'dark' ? '#202020' : '#eceff3',
      },
      buttonDisabled: {
        backgroundColor: theme === 'dark' ? '#191919' : '#f5f5f5',
        borderColor: palette.border,
      },
      icon: {
        color: palette.text,
      },
      iconDisabled: {
        color: palette.textMuted,
      },
      label: {
        color: palette.text,
      },
    };
  }, [palette, theme]);

  return (
    <View style={[styles.container, dynamic.container]}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          dynamic.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onHome}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="home-outline" size={22} style={[styles.icon, dynamic.icon]} />
        </View>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          dynamic.button,
          !canGoBack && styles.buttonDisabled,
          !canGoBack && dynamic.buttonDisabled,
          pressed && styles.buttonPressed
        ]}
        onPress={onBack}
        disabled={!canGoBack}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="chevron-back" size={22} style={[styles.icon, dynamic.icon, !canGoBack && styles.iconDisabled, !canGoBack && dynamic.iconDisabled]} />
        </View>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          dynamic.button,
          !canGoForward && styles.buttonDisabled,
          !canGoForward && dynamic.buttonDisabled,
          pressed && styles.buttonPressed
        ]}
        onPress={onForward}
        disabled={!canGoForward}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="chevron-forward" size={22} style={[styles.icon, dynamic.icon, !canGoForward && styles.iconDisabled, !canGoForward && dynamic.iconDisabled]} />
        </View>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          dynamic.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onReload}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="reload" size={21} style={[styles.icon, dynamic.icon]} />
        </View>
      </Pressable>
      {showConsoleButton ? (
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            dynamic.button,
            pressed && styles.buttonPressed
          ]}
          onPress={onOpenConsole}
        >
          <View style={styles.iconWrap}>
            <Ionicons name="terminal-outline" size={21} style={[styles.icon, dynamic.icon]} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: themeConfig.shape.radiusSm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    lineHeight: 22,
  },
  iconDisabled: {
  },
});


