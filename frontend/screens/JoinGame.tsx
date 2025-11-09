import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoBackground from "../components/VideoBackground";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { websocketManager } from "../services/websocketManager";

const JoinGame = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const [gameCode, setGameCode] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [hasAttemptedJoin, setHasAttemptedJoin] = useState(false);

  const handleJoinGame = () => {
    if (username === "" || gameCode === "") {
      Alert.alert("Please enter a username and game code");
      return;
    }

    setHasAttemptedJoin(true);
    // Connect to the game via WebSocket using manager
    websocketManager.connect(gameCode, username);
  };

  // Listen to connection state changes
  useEffect(() => {
    const removeListener = websocketManager.addConnectionStateListener(
      (connected) => {
        setIsConnected(connected);
      }
    );

    return removeListener;
  }, []);

  // Listen for game start messages
  useEffect(() => {
    const removeListener = websocketManager.addMessageListener((message) => {
      if (message.type === "gameStart") {
        // Navigate to GameScreen when game starts
        navigation.navigate("GameScreen", {
          gameCode: gameCode,
          username: username,
        });
      }
    });

    return removeListener;
  }, [gameCode, username, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <VideoBackground />
      <Text style={styles.title}>join_game</Text>

      <TextInput
        placeholderTextColor="#fff"
        placeholder="Enter Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholderTextColor="#fff"
        placeholder="Enter Game Code"
        style={styles.input}
        keyboardType="numeric"
        value={gameCode}
        onChangeText={setGameCode}
      />

      <Pressable
        style={[
          styles.button,
          isConnected && hasAttemptedJoin && styles.buttonDisabled,
        ]}
        onPress={handleJoinGame}
        disabled={isConnected && hasAttemptedJoin}
      >
        <Text style={styles.buttonText}>
          {isConnected && hasAttemptedJoin ? "Joining..." : "Join Game"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default JoinGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: "200%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#eee",
    // marginVertical: "5%",
    fontFamily: "PressStart2P_400Regular",
    marginBottom: "30%",
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#121224",
    color: "#fff",
    padding: 20,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "80%",
    marginVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 15,
    borderColor: "#B2E4F9",
    borderWidth: 2,
    margin: 10,
    backgroundColor: "#121224",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
