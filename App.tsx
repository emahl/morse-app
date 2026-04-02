import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { MorseScreen } from './src/components/MorseScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MorseScreen />
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
