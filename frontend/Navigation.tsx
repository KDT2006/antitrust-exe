import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import JoinGame from "./screens/JoinGame";
import CreateGame from "./screens/CreateGame";
import GameScreen from "./screens/GameScreen";

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="JoinGame"
          component={JoinGame}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="CreateGame"
          component={CreateGame}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
