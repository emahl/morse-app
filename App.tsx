import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigationStore } from './src/store/navigationStore';
import { MainMenu } from './src/components/MainMenu';
import { MorseScreen } from './src/components/MorseScreen';
import { SkillSelectScreen } from './src/components/educational/SkillSelectScreen';
import { LevelSelectScreen } from './src/components/educational/LevelSelectScreen';
import { LevelScreen } from './src/components/educational/LevelScreen';

export default function App() {
  const currentScreen = useNavigationStore((state) => state.currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'free':         return <MorseScreen />;
      case 'skill-select': return <SkillSelectScreen />;
      case 'level-select': return <LevelSelectScreen />;
      case 'level':        return <LevelScreen />;
      default:             return <MainMenu />;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {renderScreen()}
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
