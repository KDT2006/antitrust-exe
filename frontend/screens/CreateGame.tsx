import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoBackground from "../components/VideoBackground";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getHTTPURL } from "../config";
import { websocketManager } from "../services/websocketManager";

interface PlayerJoinMessage {
  username: string;
  playersJoined: number;
  requiredPlayers: number;
}

interface WebSocketMessage {
  type: string;
  data: any;
}

const CreateGame = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<any>;
}) => {
  const [username, setUsername] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [playersJoined, setPlayersJoined] = useState(0);
  const [requiredPlayers, setRequiredPlayers] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleCreateGame = async () => {
    if (username === "") {
      Alert.alert("Please enter a username");
      return;
    }

    setIsCreating(true);

    try {
      // Create the game
      const response = await fetch(getHTTPURL("/games"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create game");
      }

      const data = await response.json();
      const newGameCode = data.gameId;
      setGameCode(newGameCode);
      setGameCreated(true);
      setIsCreating(false);

      // Initialize with the host as the first player
      setPlayers([username]);
      setPlayersJoined(1);
      setRequiredPlayers(2); // Default required players

      // Connect to the game via WebSocket using manager
      websocketManager.connect(newGameCode, username);
    } catch (error) {
      console.error("Error creating game:", error);
      setIsCreating(false);
      Alert.alert("Error", "Failed to create game. Please try again.");
    }
  };

  // Set up message listener for WebSocket messages
  useEffect(() => {
    const removeListener = websocketManager.addMessageListener((message) => {
      console.log("Received message:", message);

      // Handle player join messages
      if (message.type === "playerJoin") {
        const playerJoinData = message.data as PlayerJoinMessage;
        console.log("Player join data:", playerJoinData);

        // Update players list if not already included
        setPlayers((prevPlayers) => {
          if (!prevPlayers.includes(playerJoinData.username)) {
            return [...prevPlayers, playerJoinData.username];
          }
          return prevPlayers;
        });

        setPlayersJoined(playerJoinData.playersJoined);
        setRequiredPlayers(playerJoinData.requiredPlayers);
      } else if (message.type === "gameStart") {
        setGameStarted(true);
        // Navigate to GameScreen when game starts
        navigation.navigate("GameScreen", {
          gameCode: gameCode,
          username: username,
        });
      }
    });

    return removeListener;
  }, [gameCode, username, navigation]);

  // Listen to connection state changes
  useEffect(() => {
    const removeListener = websocketManager.addConnectionStateListener((connected) => {
      setIsConnected(connected);
    });

    return removeListener;
  }, []);

  // Initialize players when connection is established
  useEffect(() => {
    if (isConnected && gameCreated && players.length === 0) {
      setPlayers([username]);
      setPlayersJoined(1);
      setRequiredPlayers(2);
    }
  }, [isConnected, gameCreated, username]);


  return (
    <SafeAreaView style={styles.container}>
      <VideoBackground />
      <Text style={styles.title}>create_game</Text>

      <TextInput
        placeholderTextColor="#fff"
        placeholder="Enter Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        editable={!isCreating && !gameCreated}
      />

      {gameCreated && (
        <>
          <View style={styles.gameCodeContainer}>
            <Text style={styles.gameCodeLabel}>Game Code:</Text>
            <Text style={styles.gameCode}>{gameCode}</Text>
            <Text style={styles.gameCodeHint}>
              Share this code with other players
            </Text>
          </View>

          {isConnected && (
            <View style={styles.playersContainer}>
              <Text style={styles.playersTitle}>
                Players ({playersJoined}/{requiredPlayers})
              </Text>
              <ScrollView style={styles.playersList}>
                {players.map((player, index) => (
                  <View key={index} style={styles.playerItem}>
                    <Text style={styles.playerName}>
                      {player === username ? `${player} (You)` : player}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      <Pressable
        style={[
          styles.button,
          (isCreating || gameCreated) && styles.buttonDisabled,
        ]}
        onPress={handleCreateGame}
        disabled={isCreating || gameCreated}
      >
        <Text style={styles.buttonText}>
          {isCreating
            ? "Creating..."
            : gameCreated
            ? isConnected
              ? "Joined"
              : "Joining..."
            : "Create Game"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CreateGame;

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
    marginVertical: "5%",
    fontFamily: "PressStart2P_400Regular",
    marginBottom: 50,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#121224",
    padding: 20,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "80%",
    marginVertical: 10,
  },
  gameCodeContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#121224",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "80%",
  },
  gameCodeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#eee",
    marginBottom: 10,
  },
  gameCode: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PressStart2P_400Regular",
    letterSpacing: 4,
    marginVertical: 10,
  },
  gameCodeHint: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 10,
    textAlign: "center",
  },
  playersContainer: {
    width: "80%",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#121224",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    maxHeight: 200,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eee",
    marginBottom: 10,
    textAlign: "center",
  },
  playersList: {
    maxHeight: 150,
  },
  playerItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
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
});
