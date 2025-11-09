import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import VideoBackground from "../components/VideoBackground";
import { websocketManager } from "../services/websocketManager";
import Carousel from "../components/Carousel";
import Dice from "../components/Dice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Entypo from "@expo/vector-icons/Entypo";

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

export interface PropertyPurchaseRequest {
  propertyName: string;
  accepted: boolean;
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
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasePrompt, setPurchasePrompt] =
    useState<PropertyPurchaseRequest | null>(null);

  const [addServerPrompt, setAddServerPrompt] =
    useState<AddServerPrompt | null>(null);
  type AddServerPrompt = {
    placeName: string;
    playerUsername: string;
  };
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

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
            console.log(
              "BoardState received, places:",
              boardData.places?.length || 0
            );
            setBoardState(boardData);
            setCurrentPlayer((boardData.currentPlayer || "").trim());
            break;

          case "propertyPurchaseRequest":
            // Show purchase modal when property purchase is offered
            const purchaseData = message.data as PropertyPurchaseRequest;
            console.log("Property purchase request:", purchaseData);
            setPurchasePrompt(purchaseData);
            setShowPurchaseModal(true);
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

          case "addServer":
            // Handle add server
            const addServerData = message.data as AddServerPrompt;
            console.log("Add server:", addServerData);
            setAddServerPrompt(addServerData);
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

  // Helper function to send a purchase response
  const sendPurchaseResponse = (accepted: boolean) => {
    websocketManager.sendMessage({
      type: "propertyPurchaseResponse",
      data: {
        propertyName: purchasePrompt?.propertyName,
        accepted: accepted,
        playerUsername: username,
      },
    });
    setShowPurchaseModal(false);
  };

  // Helper function to send a add server response
  const sendAddServerResponse = (accepted: boolean) => {
    if (accepted) {
      websocketManager.sendMessage({
        type: "addServer",
        data: {
          placeName: addServerPrompt?.placeName,
          playerUsername: username,
        },
      });
    }
    setAddServerPrompt(null);
  };

  // Helper function to check if it's the current player's turn
  const isMyTurn =
    currentPlayer.trim() === username.trim() && currentPlayer !== "";

  // Get current player's data
  const myPlayerData = boardState?.players.find(
    (p) => p.username.trim() === username.trim()
  );

  // Get owned places for current player
  const ownedPlaces = useMemo(() => {
    if (!myPlayerData?.ownedPlaces) return [];
    return myPlayerData.ownedPlaces;
  }, [myPlayerData]);

  // Calculate current rent based on server count
  const getCurrentRent = (place: any, serverCount: number): number => {
    switch (serverCount) {
      case 0:
        return place.rent || 0;
      case 1:
        return place.rent1Servers || 0;
      case 2:
        return place.rent2Servers || 0;
      case 3:
        return place.rent3Servers || 0;
      case 4:
        return place.rent4Servers || 0;
      case 5:
        return place.rent5Servers || 0;
      default:
        return place.rent || 0;
    }
  };

  // Render owned place item
  const renderOwnedPlace = ({
    item,
  }: {
    item: { place: any; serverCount: number };
  }) => {
    const placeColor = item.place.color;
    const currentRent = getCurrentRent(item.place, item.serverCount);

    return (
      <View style={styles.placeItem}>
        <View style={[styles.colorSquare, { backgroundColor: placeColor }]} />
        <View style={styles.placeInfo}>
          <Text style={styles.placeTitle}>{item.place.name}</Text>
          <Text style={styles.placeDetails}>
            Rent: {currentRent} • Servers: {item.serverCount}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            setAddServerPrompt({
              placeName: item.place.name,
              playerUsername: username,
            })
          }
        >
          <Entypo name="plus" size={24} color={placeColor} />
        </Pressable>
      </View>
    );
  };

  // Transform places to CarouselCard format
  const carouselCards = useMemo(() => {
    if (!boardState?.places) {
      console.log("No boardState or places");
      return [];
    }

    console.log("Board places count:", boardState.places.length);
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

      const placeColor = place.color;

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
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <VideoBackground />
        <Text style={styles.exp}>{myPlayerData?.exp} EXP</Text>

        <Text style={styles.playerText}>Current Player: {currentPlayer}</Text>

        <Carousel
          cards={carouselCards}
          currentIndex={myPlayerData?.position ?? 0}
        />

        <Dice
          onRoll={(value1, value2) => sendMove(value1, value2)}
          isMyTurn={isMyTurn}
        />
      </SafeAreaView>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={["10%", "30%", "50%"]}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>My Properties</Text>
          {ownedPlaces.length === 0 ? (
            <Text style={styles.emptyText}>
              You don't own any properties yet
            </Text>
          ) : (
            <FlatList
              data={ownedPlaces}
              renderItem={renderOwnedPlace}
              keyExtractor={(item, index) => `${item.place.name}-${index}`}
              contentContainerStyle={styles.listContent}
            />
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* Property Purchase Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#232233",
              borderRadius: 16,
              padding: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Purchase Property
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 17,
                fontFamily: "PressStart2P_400Regular",
                marginVertical: 20,
                marginBottom: 40
              }}
            >
              {purchasePrompt?.propertyName}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 10,
                  paddingVertical: 10,
                  backgroundColor: "#42fb82",
                  alignItems: "center",
                  borderRadius: 7,
                }}
                onPress={() => sendPurchaseResponse(true)}
              >
                <Text style={{ fontWeight: "bold" }}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingVertical: 10,
                  backgroundColor: "#f76060",
                  alignItems: "center",
                  borderRadius: 7,
                }}
                onPress={() => sendPurchaseResponse(false)}
              >
                <Text style={{ fontWeight: "bold" }}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Server Modal */}
      <Modal
        visible={addServerPrompt !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setAddServerPrompt(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#232233",
              borderRadius: 16,
              padding: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Add Server
            </Text>
            <Text style={{ color: "#fff", fontSize: 17, marginBottom: 8 }}>
              {addServerPrompt?.placeName}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 10,
                  paddingVertical: 10,
                  backgroundColor: "#42fb82",
                  alignItems: "center",
                  borderRadius: 7,
                }}
                onPress={() => sendAddServerResponse(true)}
              >
                <Text style={{ fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 10,
                  paddingVertical: 10,
                  backgroundColor: "#f76060",
                  alignItems: "center",
                  borderRadius: 7,
                }}
                onPress={() => sendAddServerResponse(false)}
              >
                <Text style={{ fontWeight: "bold" }}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  exp: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#eee",
    marginVertical: "5%",
    fontFamily: "PressStart2P_400Regular",
    textAlign: "center",
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
  bottomSheetBackground: {
    backgroundColor: "#1a1a1a",
  },
  bottomSheetIndicator: {
    backgroundColor: "#B2E4F9",
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#eee",
    marginBottom: 20,
    fontFamily: "PressStart2P_400Regular",
  },
  listContent: {
    paddingBottom: 20,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  colorSquare: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#eee",
    marginBottom: 4,
  },
  placeDetails: {
    fontSize: 14,
    color: "#bbb",
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
});
