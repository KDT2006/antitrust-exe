import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoBackground from "../components/VideoBackground";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const HomeScreen = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <VideoBackground />

      <Text style={styles.title}>antitrust.exe</Text>
      <View>
        <Pressable
          onPress={() => navigation.navigate("JoinGame")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Join Game</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("CreateGame")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Game</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Instructions</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#eee",
    marginVertical: "5%",
    fontFamily: "PressStart2P_400Regular",
  },
  button: {
    padding: 15,
    borderRadius: 15,
    borderColor: "white",
    borderWidth: 5,
    margin: 10,
    backgroundColor: "rgba(255, 255, )",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
