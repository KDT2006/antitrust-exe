import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";

const VideoBackground = () => {
  const videoSource = require("../assets/video/bg2.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="transparent" />
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture
        nativeControls={false}
        contentFit="cover"
      />
      <BlurView
        intensity={Platform.OS === "ios" ? 30 : 50}
        style={styles.blur}
        tint="systemChromeMaterialDark"
      />
    </View>
  );
};

export default VideoBackground;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
});
