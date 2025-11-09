import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import VideoBackground from '../components/VideoBackground';
import HomeContent from '../components/HomeContent';
import UsernameModal from '../components/UsernameModal';

const HomeScreen = () => {
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);

  const handleJoinGame = () => {
    setIsUsernameModalVisible(true);
  };

  const handleUsernameSubmit = (username: string) => {
    // TODO: Send username to backend here
    // You can call a function like: sendUsernameToBackend(username)
    
    setIsUsernameModalVisible(false);
    // For now, just show an alert - replace this with your backend call
    Alert.alert('Success', `Joining game as ${username}`);
  };

  const handleUsernameCancel = () => {
    setIsUsernameModalVisible(false);
  };

  const handleCreateGame = () => {
    Alert.alert('Create Game pressed');
  };

  const handleHowToPlay = () => {
    Alert.alert('How to Play pressed');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <VideoBackground />
        <HomeContent
          onJoinGame={handleJoinGame}
          onCreateGame={handleCreateGame}
          onHowToPlay={handleHowToPlay}
        />
      </View>

      <UsernameModal
        visible={isUsernameModalVisible}
        onClose={handleUsernameCancel}
        onSubmit={handleUsernameSubmit}
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
