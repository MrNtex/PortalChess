import React, { createContext, useState } from 'react';

// Create a context
export const SettingsContext = createContext({
  rotateBoard: false,
  setRotateBoard: () => {},
  darkMode: true,
  setDarkMode: () => {},
});

// Create a provider component
export const SettingsProvider = ({ children }) => {
  const [rotateBoard, setRotateBoard] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // The value prop of the provider will provide these to any descendants
  const value = {
    rotateBoard,
    setRotateBoard,
    darkMode,
    setDarkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
