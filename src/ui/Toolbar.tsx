import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export interface ToolbarProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onHome: () => void;
}

export default function Toolbar(props: ToolbarProps) {
  const { canGoBack, canGoForward, onBack, onForward, onReload, onHome } = props;
  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onHome}
      >
        <Text style={styles.icon}>⌂</Text>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          !canGoBack && styles.buttonDisabled,
          pressed && styles.buttonPressed
        ]}
        onPress={onBack}
        disabled={!canGoBack}
      >
        <Text style={[styles.icon, !canGoBack && styles.iconDisabled]}>◀</Text>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          !canGoForward && styles.buttonDisabled,
          pressed && styles.buttonPressed
        ]}
        onPress={onForward}
        disabled={!canGoForward}
      >
        <Text style={[styles.icon, !canGoForward && styles.iconDisabled]}>▶</Text>
      </Pressable>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
        onPress={onReload}
      >
        <Text style={styles.icon}>↻</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  button: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
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
    backgroundColor: '#e9ecef',
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e8e8e8',
    opacity: 0.6,
  },
  icon: {
    fontSize: 24,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  iconDisabled: {
    color: '#999999',
  },
});


