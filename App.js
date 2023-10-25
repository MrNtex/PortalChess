import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


import ChessBoard from './ChessBoard.js';

function ChessBoardScreen() {
  return (
    <View style={{ flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center', }}>
      <ChessBoard/>
    </View>
  );
}
function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings S</Text>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profle</Text>
    </View>
  );
}
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Play') {
            iconName = focused ? 'play' : 'play-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'build' : 'build-outline';
          } else if (route.name === 'My Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } 


          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // hide the top bar
        "tabBarActiveTintColor": "#d6b892",
        "tabBarInactiveTintColor": "gray",
        "tabBarStyle": [
          {
            "display": "flex"
          },
          null
        ]
      })}>
        <Tab.Screen name="Play" component={ChessBoardScreen }/>
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="My Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  
  return (
    <View style={styles.container}>
      
      <StatusBar style="auto" />
      <MyTabs/>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  boardContainer: {
    marginTop: 20,  // Add some spacing between the text and the board
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'white',
  },
  borderCell: {
    backgroundColor: 'black',
    height: 35,
  },
  whiteCell: {
    //backgroundColor: '#edc200',
    backgroundColor: '#d6b892',
  },
  blackCell: {
    backgroundColor: '#242424',
  },
  whiteCellHighlight: {
    //backgroundColor: '#edc200',
    backgroundColor: '#faf3eb',
  },
  blackCellHighlight: {
    backgroundColor: '#737373',
  },
  cellText: {
    color: 'white',
    left: 3,
    fontSize: 12,
    position: 'absolute',
    bottom: 0,
  },
  borderCellText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    top: 8,
  },
  piece: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    top: 8,
  },

  roundText: {
    color: 'white',
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  capturedPiece: {
    top:4,
    color: '#9c9c9c',
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  countColor: {
    color: '#f7f7f7'
  },

  //Modal
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // This ensures the modal is on top of everything else
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  }
});