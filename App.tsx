import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/index';
import BrowserScreen from './app/browser';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Browser"
        component={BrowserScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
