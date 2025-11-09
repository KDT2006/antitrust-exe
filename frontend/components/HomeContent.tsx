import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './Button';

export interface HomeContentProps {
  onJoinGame: () => void;
  onCreateGame: () => void;
  onHowToPlay: () => void;
}

const HomeContent: React.FC<HomeContentProps> = ({
  onJoinGame,
  onCreateGame,
  onHowToPlay,
}) => {
  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            anti-trust.exe
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Join Game"
            onPress={onJoinGame}
          />
          <Button
            title="Create Game"
            onPress={onCreateGame}
          />
          <Button
            title="How to Play"
            onPress={onHowToPlay}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    marginHorizontal: 16,
  },
  titleContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeContent;

