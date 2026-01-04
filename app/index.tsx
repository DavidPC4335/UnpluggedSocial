import React from 'react';
import { SafeAreaView, View, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SiteKey } from '../src/config/sites';

type RootStackParamList = {
  Home: undefined;
  Browser: { site: SiteKey };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.button}>
          <Button title="Open Instagram" onPress={() => navigation.navigate('Browser', { site: 'instagram' })} />
        </View>
        <View style={styles.button}>
          <Button title="Open Facebook" onPress={() => navigation.navigate('Browser', { site: 'facebook' })} />
        </View>
        <View style={styles.button}>
          <Button title="Open TikTok" onPress={() => navigation.navigate('Browser', { site: 'tiktok' })} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  button: {
    marginVertical: 8,
  },
});


