import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateScreen from './screens/CreateScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <CreateScreen />
    </SafeAreaProvider>
  );
}