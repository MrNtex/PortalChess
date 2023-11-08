import React, { useState, useContext } from 'react';
import { View, Switch, Button, Modal, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsContext } from './SettingsContext';

const SettingsMenu = () => {
  const [isAuthorsModalVisible, setIsAuthorsModalVisible] = useState(false);
  const { rotateBoard, setRotateBoard, darkMode, setDarkMode } = useContext(SettingsContext);

  const toggleRotateBoard = () => setRotateBoard(previousState => !previousState);
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);

  const openAuthorsModal = () => setIsAuthorsModalVisible(true);
  const closeAuthorsModal = () => setIsAuthorsModalVisible(false);

  return (
    <View style={darkMode ? styles.container : styles.containerLight}>
      {/* Rotate Chessboard Toggle */}
      <View style={styles.toggleContainer}>
        <Ionicons name={rotateBoard ? "sync" : "sync-outline"} size={24} color={darkMode ? "white" : "darkgray"} />
        <Text style={darkMode ? styles.buttonText : styles.buttonTextLight}>Rotate Chessboard</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#d6b892" }}
          thumbColor={rotateBoard ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={toggleRotateBoard}
          value={rotateBoard}
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.toggleContainer}>
        <Ionicons name={darkMode ? "moon" : "moon-outline"} size={24} color={darkMode ? "white" : "darkgray"} />
        <Text style={darkMode ? styles.buttonText : styles.buttonTextLight}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#d6b892" }}
          thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>

      {/* Authors Button */}
      <Button style={styles.buttonStyle} title="Authors" onPress={openAuthorsModal} />

      {/* Authors Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAuthorsModalVisible}
        onRequestClose={closeAuthorsModal}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Portal Chess</Text>
          <Text style={styles.modalVersion}>Version 1.0.0</Text>
          <Text style={styles.modalSpecialThanks}>Author: Artur Niemiec</Text>
          <Ionicons name="logo-youtube" size={24} color="black" />
          <Text style={styles.modalText}>CodeForge</Text>
          <Text style={styles.modalText}> </Text>
          <Text style={styles.modalSpecialThanks}>Special thanks to:</Text>
          <Text style={styles.modalSpecialThanksContents}>Dominik Wójtowicz</Text>
          <Text style={styles.modalSpecialThanksContents}>Kamil Jach</Text>
          <Ionicons name="logo-react" size={24} color="black" />
          <Text style={styles.modalText}>Made using React-Native</Text>
          <Text style={styles.modalText}>Artur Niemeic Industries</Text>
          <Button title="Close" style={styles.buttonStyle} onPress={closeAuthorsModal} />
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  containerLight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#767577',
    padding: 10,
    borderRadius: 10,
    width: 200,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
  },
  buttonText:{
    color: 'white',
    fontSize: 20,
  },
  buttonTextLight:{
    color: 'black',
    fontSize: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalSpecialThanksContents: {
    marginBottom: 8,
    textAlign: "center"
  },
  modalVersion: {
    marginBottom: 8,
    fontSize: 8,
    textAlign: "center"
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 1,
    textAlign: "center",
    fontWeight: 'bold',
  },

  modalSpecialThanks: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: 'bold',
  }
});

export default SettingsMenu;