import { View, Text, Dimensions, StyleSheet, Pressable } from "react-native";

import React, { useState } from "react";
import Animated, {
  CSSAnimationKeyframes,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const { width } = Dimensions.get("screen");
export const _imageWidth = width * 0.7;
export const _imageHeight = _imageWidth * 1.5;

const Card = ({
  item,
  index,
  scrollX,
}: {
  item: {
    Regular: { Location: string; Price: number };
    Flipped: { 
      PlayerType?: string;
      PropertyName: string;
      BaseRent: number;
      ServerCost?: number;
      Rent1Servers?: number;
      Rent2Servers?: number;
      Rent3Servers?: number;
      Rent4Servers?: number;
      Rent5Servers?: number;
    };
    Color: string;
  };
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const isFlipped = useSharedValue(false);
  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 400 });
    return {
      transform: [{ rotateY: rotateValue }],
    };
  });
  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration: 400 });
    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  return (
    <Pressable onPress={() => (isFlipped.value = !isFlipped.value)}>
      <View style={{ marginVertical: 10 }}>
        <Animated.View
          style={[
            styles.regularCard,
            styles.cardContainer,
            regularCardAnimatedStyle,
            styles.cardContainer,
            {
              borderColor: item.Color,
              borderWidth: 2,
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 4,
                  color: item.Color,
                  spreadDistance: 2,
                },
              ],
            },
          ]}
        >
          {/* Content */}
          <View style={styles.contentContainer}>
            <Animated.View style={[styles.textContainer]}>
              <Text numberOfLines={1} style={styles.title}>{item.Regular.Location ?? ""}</Text>
              {item.Regular.Price > 0 ? (
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>EXP</Text>
                  <Animated.Text style={[styles.price]}>
                    {item.Regular.Price}
                  </Animated.Text>
                </View>
              ) : null}
            </Animated.View>
            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <View style={styles.cornerAccent} />
              <View style={[styles.cornerAccent, styles.cornerAccentBottom]} />
            </View>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.cardContainer,
            styles.flippedCard,
            flippedCardAnimatedStyle,
            styles.cardContainer,
            {
              borderColor: item.Color,
              borderWidth: 2,
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 0,
                  blurRadius: 4,
                  color: item.Color,
                  spreadDistance: 2,
                },
              ],
            },
          ]}
        >
          {/* Content */}
          <View style={styles.contentContainer}>
            <Animated.View style={[styles.textContainer]}>
              {/* Player Type at top */}
              {item.Flipped.PlayerType ? (
                <Text style={styles.playerType}>
                  {item.Flipped.PlayerType === "competitor" ? "Competitor" : "Monopolist"}
                </Text>
              ) : null}
              
              {/* Property Name in larger font */}
              <Text style={styles.propertyName}>{item.Flipped.PropertyName ?? ""}</Text>
              
              {/* Base Rent in same size as player type */}
              <Text style={styles.baseRent}>Base Rent: {item.Flipped.BaseRent ?? 0} EXP</Text>
              
              {/* Server Cost */}
              {item.Flipped.ServerCost && item.Flipped.ServerCost > 0 ? (
                <Text style={styles.serverCost}>Server Cost: {item.Flipped.ServerCost} EXP</Text>
              ) : null}
              
              {/* Rents for each number of servers */}
              <View style={styles.rentsContainer}>
                {item.Flipped.Rent1Servers && item.Flipped.Rent1Servers > 0 ? (
                  <Text style={styles.rentItem}>1 Server: {item.Flipped.Rent1Servers} EXP</Text>
                ) : null}
                {item.Flipped.Rent2Servers && item.Flipped.Rent2Servers > 0 ? (
                  <Text style={styles.rentItem}>2 Servers: {item.Flipped.Rent2Servers} EXP</Text>
                ) : null}
                {item.Flipped.Rent3Servers && item.Flipped.Rent3Servers > 0 ? (
                  <Text style={styles.rentItem}>3 Servers: {item.Flipped.Rent3Servers} EXP</Text>
                ) : null}
                {item.Flipped.Rent4Servers && item.Flipped.Rent4Servers > 0 ? (
                  <Text style={styles.rentItem}>4 Servers: {item.Flipped.Rent4Servers} EXP</Text>
                ) : null}
                {item.Flipped.Rent5Servers && item.Flipped.Rent5Servers > 0 ? (
                  <Text style={styles.rentItem}>5 Servers: {item.Flipped.Rent5Servers} EXP</Text>
                ) : null}
              </View>
            </Animated.View>
            {/* Decorative Elements */}
            <View style={styles.decorativeElements}>
              <View style={styles.cornerAccent} />
              <View style={[styles.cornerAccent, styles.cornerAccentBottom]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: _imageWidth,
    height: _imageHeight,
    backgroundColor: "#121224",
    borderWidth: 2,
    borderRadius: 20,
    backfaceVisibility: "hidden",
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 23,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "PressStart2P_400Regular",
  },
  description: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  playerType: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  propertyName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "PressStart2P_400Regular",
  },
  baseRent: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  serverCost: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rentsContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  rentItem: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    backgroundColor: "rgba(36, 199, 188, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(36, 199, 188, 0.3)",
    marginTop: 75,
  },
  currency: {
    color: "#24c7bc",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 4,
  },
  price: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  cornerAccent: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 3,
    backgroundColor: "#24c7bc",
    borderRadius: 2,
    opacity: 0.8,
  },
  cornerAccentBottom: {
    top: "auto",
    bottom: 20,
    right: "auto",
    left: 20,
    width: 3,
    height: 50,
  },
  regularCard: {
    position: "absolute",
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
});

export default Card;

