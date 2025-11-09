import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur';

const videoSource = require('../assets/video/backgroundImage.mp4');

const { width, height } = Dimensions.get('window');

// Editable blur constants - Platform-specific because iOS and Android use different blur implementations
// iOS uses native UIVisualEffectView (0-100), Android uses software blur (0-100 but different visual result)
const BACKGROUND_BLUR_INTENSITY_IOS = 20; // Adjust this value (0-100) for iOS blur intensity
const BACKGROUND_BLUR_INTENSITY_ANDROID = 100; // Adjust this value (0-100) for Android blur intensity
const BACKGROUND_BLUR_INTENSITY = Platform.OS === 'ios' ? BACKGROUND_BLUR_INTENSITY_IOS : BACKGROUND_BLUR_INTENSITY_ANDROID;
const BLUR_TINT = 'dark'; // Options: 'light', 'dark', 'default' - or use 'blue' for dimmed blue view
const USE_DIMMED_BLUE_VIEW = false; // Set to true for dimmed blue overlay, false for standard blur
const BLUE_OVERLAY_OPACITY = 0.3; // Adjust opacity (0-1) of the blue overlay

const VideoBackground: React.FC = () => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
});

export default VideoBackground;

