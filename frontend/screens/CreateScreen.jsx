import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import VideoBackground from "../components/VideoBackground";

const CreateScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <VideoBackground />
      <Text style={styles.title}>create_game</Text>
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
});
