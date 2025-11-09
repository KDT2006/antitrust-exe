import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoBackground from "../components/VideoBackground";
import { websocketManager } from "../services/websocketManager";
import Carousel from "../components/Carousel";
import Dice from "../components/Dice";

// Type definitions for game state
export interface Player {
  username: string;
  role: string;
  position: number;
  exp: number;
  hasJailFree: boolean;
  jailAttempts: number;
  ownedPlaces: Array<{ place: any; serverCount: number }>;
  hasExtraTurn: boolean;
  consecutiveDoubles: number;
}

export interface Place {
  name: string;
  description: string;
  price: number;
  rent: number;
  color: string;
  owner: string;
  numServers: number;
  priceOfServers?: number;
  rent1Servers?: number;
  rent2Servers?: number;
  rent3Servers?: number;
  rent4Servers?: number;
  rent5Servers?: number;
}

export interface Card {
  name: string;
  description: string;
}

export interface BoardState {
  players: Player[];
  places: Place[];
  currentPlayer: string;
  competitorCards: Card[];
  monopolistCards: Card[];
  jail: string[];
}

const GameScreen = ({
  route,
  navigation,
}: {
  route: RouteProp<any, any>;
  navigation: NativeStackNavigationProp<any>;
}) => {
  const { gameCode, username } = route.params as {
    gameCode: string;
    username: string;
  };

  // Game state - all exposed for you to use in your components
  const [boardState, setBoardState] = useState<BoardState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>("");

  // Set up WebSocket message listeners
  useEffect(() => {
    // Listen for all WebSocket messages
    const removeMessageListener = websocketManager.addMessageListener(
      (message) => {
        console.log("GameScreen received message:", message);

        switch (message.type) {
          case "boardState":
            // Update board state when received
            const boardData = message.data as BoardState;
            setBoardState(boardData);
            setCurrentPlayer((boardData.currentPlayer || "").trim());
            break;

          case "properties":
            // Properties are handled via boardState
            break;

          case "cards":
            // Cards are handled via boardState
            break;

          case "playerJoin":
            // Handle player join
            console.log("Player joined:", message.data);
            break;

          case "winner":
            // Handle game end
            console.log("Winner:", message.data.winner);
            break;

          default:
            console.log("Unknown message type:", message.type);
        }
      }
    );

    // Listen for connection state changes
    const removeConnectionListener =
      websocketManager.addConnectionStateListener((connected) => {
        setIsConnected(connected);
      });

    // Cleanup listeners when component unmounts
    return () => {
      removeMessageListener();
      removeConnectionListener();
    };
  }, []);

  // Helper function to send a move message
  const sendMove = (dice1: number, dice2: number) => {
    websocketManager.sendMessage({
      type: "move",
      data: {
        username: username,
        diceAmount1: dice1,
        diceAmount2: dice2,
      },
    });
  };

  // Helper function to check if it's the current player's turn
  const isMyTurn =
    currentPlayer.trim() === username.trim() && currentPlayer !== "";

  // Get current player's data
  const myPlayerData = boardState?.players.find(
    (p) => p.username.trim() === username.trim()
  );

  // Transform places to CarouselCard format
  const carouselCards = useMemo(() => {
    if (!boardState?.places) return [];

    const colorMap: { [key: string]: string } = {
      brown: "#8B4513",
      lightBlue: "#87CEEB",
      pink: "#FF69B4",
      orange: "#FFA500",
      red: "#FF6347",
      yellow: "#FFD700",
      green: "#32CD32",
      darkBlue: "#00008B",
    };

    return boardState.places.map((place) => {
      // Find owner's role if place is owned
      let ownerRole: string | undefined = undefined;
      if (place.owner && boardState.players) {
        const owner = boardState.players.find(
          (p) => p.username === place.owner
        );
        if (owner) {
          ownerRole = owner.role;
        }
      }

      const placeColor = place.color
        ? colorMap[place.color] || "#2196f3"
        : "#2196f3";

      return {
        Regular: {
          Location: place.name,
          Price: place.price,
        },
        Flipped: {
          PlayerType: ownerRole,
          PropertyName: place.name,
          BaseRent: place.rent || 0,
          ServerCost: place.priceOfServers,
          Rent1Servers: place.rent1Servers,
          Rent2Servers: place.rent2Servers,
          Rent3Servers: place.rent3Servers,
          Rent4Servers: place.rent4Servers,
          Rent5Servers: place.rent5Servers,
        },
        Color: placeColor,
      };
    });
  }, [boardState]);

  return (
    <SafeAreaView style={styles.container}>
      <VideoBackground />
      <Text style={styles.title}>Game Screen</Text>

      <Text style={styles.playerText}>Current Player: {currentPlayer}</Text>

      {/* Basic info display - replace this with your own components
      {boardState && (
        <View style={styles.gameInfo}>
          <Text style={styles.infoText}>
            Connected: {isConnected ? "Yes" : "No"}
          </Text>
          <Text style={styles.infoText}>
            Current Player: {currentPlayer || "None"}
          </Text>
          <Text style={styles.infoText}>
            Is My Turn: {isMyTurn ? "Yes" : "No"}
          </Text>
          {myPlayerData && (
            <>
              <Text style={styles.infoText}>
                My Position: {myPlayerData.position}
              </Text>
              <Text style={styles.infoText}>
                My EXP: {myPlayerData.exp}
              </Text>
              <Text style={styles.infoText}>
                My Role: {myPlayerData.role}
              </Text>
            </>
          )}
          <Text style={styles.infoText}>
            Places: {boardState.places?.length || 0}
          </Text>
          <Text style={styles.infoText}>
            Players: {boardState.players?.length || 0}
          </Text>
        </View>
      )} */}

      <Carousel
        cards={carouselCards}
        currentIndex={myPlayerData?.position || 0}
      />

      <Dice onRoll={(value1, value2) => sendMove(value1, value2)} isMyTurn={isMyTurn} />

      {/* 
        TODO: Build your own components here!
        
        Available state:
        - boardState: BoardState | null - Full game state
        - isConnected: boolean - WebSocket connection status
        - currentPlayer: string - Username of current player
        - isMyTurn: boolean - Whether it's the current user's turn
        - myPlayerData: Player | undefined - Current user's player data
        
        Helper functions:
        - sendMove(dice1: number, dice2: number) - Send a dice roll to the server
      */}
    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#eee",
    marginVertical: "5%",
    fontFamily: "PressStart2P_400Regular",
  },
  gameInfo: {
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(24, 33, 89, 0.5)",
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#eee",
    marginVertical: 5,
  },
  playerText: {
    fontSize: 14,
    color: "#eee",
    marginVertical: 5,
  },
});
