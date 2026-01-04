import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

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
      <View style={styles.button}>
        <Button title="Home" onPress={onHome} />
      </View>
      <View style={styles.button}>
        <Button title="Back" onPress={onBack} disabled={!canGoBack} />
      </View>
      <View style={styles.button}>
        <Button title="Forward" onPress={onForward} disabled={!canGoForward} />
      </View>
      <View style={styles.button}>
        <Button title="Reload" onPress={onReload} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});


