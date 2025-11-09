import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { CSSAnimationKeyframes } from "react-native-reanimated";

const Change = ({ expChange }: { expChange: number }) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation restart whenever expChange changes and is non-zero
  useEffect(() => {
    if (expChange !== 0) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [expChange]);

  const animateMoney: CSSAnimationKeyframes = {
    0: {
      opacity: 0,
    },
    0.5: {
      opacity: 0.7,
    },
    1: {
      opacity: 0,
    },
  };

  return (
    <Animated.View
      key={animationKey}
      style={[
        styles.container,
        {
          animationName: animateMoney,
          animationDuration: "2s",
          animationIterationCount: 1,
        },
      ]}
    >
      {expChange !== 0 && <Animated.Text
        style={[
          styles.expText,
          {
            color: expChange > 0 ? "#33b859" : "#eb6834",
          },
        ]}
      >
        {expChange > 0 ? `+ ${expChange} EXP` : `${expChange} EXP`}
      </Animated.Text>}
    </Animated.View>
  );
};

export default Change;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
  },
  expText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
