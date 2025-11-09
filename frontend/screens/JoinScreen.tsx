import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import VideoBackground from '../components/VideoBackground';
import Button from '../components/Button';

const JoinScreen = () => {
  const [gameCode, setGameCode] = useState('');

  const handleJoin = () => {
    if (gameCode.length !== 6) {
      // TODO: Show error or validation
      return;
    }
    // TODO: Send game code to backend
    console.log('Joining game with code:', gameCode);
  };

  const handleCodeChange = (text: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 6) {
      setGameCode(numericText);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <VideoBackground />
        <SafeAreaView style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Join Game
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="Enter Code"
                placeholderTextColor="#999"
                value={gameCode}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus={true}
              />
              <Button
                title="Join"
                onPress={handleJoin}
                disabled={gameCode.length !== 6}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    fontSize: 24,
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 30,
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 4,
    width: 250,
  },
});

export default JoinScreen;
