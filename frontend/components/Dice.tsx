import { Button, Pressable, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

const Dice = ({ onRoll, isMyTurn = true }: { onRoll: (value1: number, value2: number) => void; isMyTurn?: boolean }) => {
  const [side1, setSide1] = useState(1);
  const [side2, setSide2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Reset rolling state when it becomes the player's turn
  useEffect(() => {
    if (isMyTurn) {
      setIsRolling(false);
    }
  }, [isMyTurn]);
  
  const getDiceIcon = (side: number): string => {
    switch (side) {
      case 1:
        return "dice-one";
      case 2:
        return "dice-two";
      case 3:
        return "dice-three";
      case 4:
        return "dice-four";
      case 5:
        return "dice-five";
      case 6:
        return "dice-six";
      default:
        return "dice-one";
    }
  };

  const rollDice = () => {
    // Prevent rolling if it's not the player's turn or if already rolling
    if (!isMyTurn || isRolling) {
      return;
    }

    setIsRolling(true);
    
    // Reset values
    rotation.value = 0;
    scale.value = 1;

    // Animate transform properties
    rotation.value = withSequence(
      withTiming(180, { duration: 400 }),
      withTiming(0, { duration: 400 })
    );

    scale.value = withSequence(
      withTiming(1.25, { duration: 400 }),
      withTiming(1, { duration: 400 })
    );

    // Update dice faces during the animation
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const newSide1 = Math.floor(Math.random() * 6) + 1;
        const newSide2 = Math.floor(Math.random() * 6) + 1;
        setSide1(newSide1);
        setSide2(newSide2);

        if (i === 1) {
          onRoll(newSide1, newSide2);
          // Reset rolling state after animation completes (800ms total animation time)
          setTimeout(() => {
            setIsRolling(false);
          }, 50);
        }
      }, i * 400);
    }
  };

  // Animated style for the container (handles rotation and scale)
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  return (
    <View style={{ padding: 20, alignItems: "center" }}>
      <Pressable
        style={{ 
          flexDirection: "row", 
          gap: 20, 
          marginBottom: 20,
          opacity: isMyTurn && !isRolling ? 1 : 0.5
        }}
        onPress={rollDice}
        disabled={!isMyTurn || isRolling}
      >
        <Animated.View style={containerAnimatedStyle}>
          <FontAwesome5 name={getDiceIcon(side1)} size={50} color="#33b8b6" />
        </Animated.View>
        <Animated.View style={containerAnimatedStyle}>
          <FontAwesome5 name={getDiceIcon(side2)} size={50} color="#33b8b6" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default Dice;
