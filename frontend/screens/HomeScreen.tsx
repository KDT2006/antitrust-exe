import React from 'react';
import { StyleSheet, View, Text, Alert, Dimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';

import Button from '../components/Button';

const videoSource = require('../assets/video/final_looped.mp4');

const { width, height } = Dimensions.get('window');

// Editable blur constants
const BACKGROUND_BLUR_INTENSITY = 100; // Adjust this value (0-100) to change blur intensity
const BLUR_TINT = 'dark'; // Options: 'light', 'dark', 'default' - or use 'blue' for dimmed blue view
const USE_DIMMED_BLUE_VIEW = false; // Set to true for dimmed blue overlay, false for standard blur
const BLUE_OVERLAY_OPACITY = 0.3; // Adjust opacity (0-1) of the blue overlay

const HomeScreen = () => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          fullscreenOptions={{
            enable: false,
          }}
        />
        {BACKGROUND_BLUR_INTENSITY > 0 && (
          <BlurView
            intensity={BACKGROUND_BLUR_INTENSITY}
            style={styles.blurOverlay}
            tint={USE_DIMMED_BLUE_VIEW ? 'dark' : BLUR_TINT}
          />
        )}
        {USE_DIMMED_BLUE_VIEW && (
          <View style={[styles.blurOverlay, { backgroundColor: `rgba(0, 13, 26, ${BLUE_OVERLAY_OPACITY})` }]} />
        )}
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
                onPress={() => Alert.alert('Join Game pressed')}
              />
              <Button
                title="Create Game"
                onPress={() => Alert.alert('Create Game pressed')}
              />
              <Button
                title="How to Play"
                onPress={() => Alert.alert('How to Play pressed')}
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
  video: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  blurOverlay: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
