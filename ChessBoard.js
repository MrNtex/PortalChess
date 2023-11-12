import React, { useMemo, useEffect, useContext } from 'react';
import { useState, memo } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StyleSheet, Text, TouchableOpacity, View, Image, Modal  } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import SettingsMenu, { rotateBoard } from './SettingsMenu.js';
import { SettingsContext, SettingsProvider } from './SettingsContext';

import BlackKing from './Pieces/BlackKing.png';
import BlackQueen from './Pieces/BlackQueen.png';
import BlackRook from './Pieces/BlackRook.png';
//import BlackBishop from '.Pieces/BlackBishop.png';
import BlackKnight from './Pieces/BlackKnight.png';
import BlackPawn from './Pieces/BlackPawn.png';
import WhiteKing from './Pieces/WhiteKing.png';
import WhiteQueen from './Pieces/WhiteQueen.png';
//import WhiteBishop from './Pieces/WhiteBishop.png';
import WhiteRook from './Pieces/WhiteRook.png';
import WhiteKnight from './Pieces/WhiteKnight.png';
import WhitePawn from './Pieces/WhitePawn.png';


const chessPieceImages = {
  'k': BlackKing,
  'q': BlackQueen,
  'r': BlackRook,
  'n': BlackKnight,
  'p': BlackPawn,
  'K': WhiteKing,
  'Q': WhiteQueen,
  'R': WhiteRook,
  'N': WhiteKnight,
  'P': WhitePawn,
};
const initialChessBoard = [
  ['N', 'Q', 'K', 'R'],
  ['P', 'P', 'P', 'P'],
  [null, null, null, null,],
  [null, null, null, null,],
  [null, null, null, null,],
  [null, null, null, null,],
  ['p', 'p', 'p', 'p'],
  ['n', 'q', 'k', 'r'],
];
const DEFAULT_HIGHLIGHTS = [
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
  [false, false, false, false],
];

const DummyComponent = () => null;
const ChessBoard = () => {

  //CHESS BOARD
  const deepCopyChessBoard = (board) => board.map(row => [...row]);
  //TURN True = White, False = Black
  function ResetBoard() {
    setChessBoard(deepCopyChessBoard(initialChessBoard));
    setCurrentTurn(true);
    setHighLights(DEFAULT_HIGHLIGHTS);
    setWhitePiecesCaptured([]);
    setBlackPiecesCaptured([]);
  };
  const [currentTurn, setCurrentTurn] = useState(true);
  const hideNavigationBar = async () => {
    // Setting the visibility status of the Navigation Bar to "hidden".
    await NavigationBar.setVisibilityAsync("hidden");
  };

  const handlePress = (row, col) => {
    hideNavigationBar();
    if(col >= 0 && col <= 4 && row >= 1 && row <= 8){
      SelectPiece(row, col);
    }
  };
  const [selectedPiece, setSelectedPiece] = useState({
    row: 0,
    col: 0,
    type: "p",
    white: true
  })
  
  const [highLightsArray, setHighLights] = useState([
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]);
  const [currentChessBoard, setChessBoard] = useState([
    ['N', 'Q', 'K', 'R'],
    ['P', 'P', 'P', 'P'],
    [null, null, null, null,],
    [null, null, null, null,],
    [null, null, null, null,],
    [null, null, null, null,],
    ['p', 'p', 'p', 'p'],
    ['n', 'q', 'k', 'r'],
  ]);
  //Loop through the board and check if there are any pieces other than kings and knights
  function TestForStalemate(){
    for(i = 0; i<8; i++){
      for(j=0; j<4; j++){
        if(currentChessBoard[i][j] !== null){
          if(currentChessBoard[i][j] === "K" || currentChessBoard[i][j] === "k" || currentChessBoard[i][j] === "N" || currentChessBoard[i][j] === "n"){
            continue;
          }else{
            return false;
          }
        }
      }
    }
    return true;
  }
  useEffect(() => {
    if(whitePiecesCaptured.length >= 6 && blackPiecesCaptured.length >= 6)
    {
      if(TestForStalemate){
        setIsStaleMateModalVisible(true);
      }
    } 
    if (!CheckChessBoard(currentTurn)) {
      if(!SelectPiece(0,0,false,true)){
        setIsCheckMateModalVisible(true);
        return;
      }else{
        setIsStaleMateModalVisible(true);
      }
    }
  }, [currentChessBoard, currentTurn]); 
  const [currentChessBoardToTest, setChessBoardToTest] = useState([
    ['N', 'Q', 'K', 'R'],
    ['P', 'P', 'P', 'P'],
    [null, null, null, null,],
    [null, null, null, null,],
    [null, null, null, null,],
    [null, null, null, null,],
    ['p', 'p', 'p', 'p'],
    ['n', 'q', 'k', 'r'],
  ]);
  const [blackPiecesCaptured, setBlackPiecesCaptured] = useState([]);
  const [whitePiecesCaptured, setWhitePiecesCaptured] = useState([]);
  const [king, setKing] = useState({
    whiteKingRow: 0,
    whiteKingCol: 2,
    blackKingRow: 7,
    blackKingCol: 2,
  });
  const CheckChessBoard = (turn) => {
    
    if(turn){
      // White Pieces
      for(let i = 0; i < currentChessBoard.length; i++){
        for(let j = 0; j < currentChessBoard[i].length; j++){
          
          if(currentChessBoard[i][j] !== null && currentChessBoard[i][j] == currentChessBoard[i][j].toUpperCase()){
            if(SelectPiece(i+1,j,true)){
              return true;
            }
          }
        }
      }
      return false;
    }else{
      // Black Pieces
      for(let i = 0; i < currentChessBoard.length; i++){
        for(let j = 0; j < currentChessBoard[i].length; j++){
          
          if(currentChessBoard[i][j] !== null && currentChessBoard[i][j] == currentChessBoard[i][j].toLowerCase()){
            if(SelectPiece(i+1,j,true)){
              return true;
            }
          }
        }
      }
      return false;
    }
  }

  const CheckForEnemyPiece = (rowIndex, colIndex, white) => {
    if(currentChessBoard[rowIndex][colIndex] == null){
      return false;
    }
    if(!white){
      if(currentChessBoard[rowIndex][colIndex] == currentChessBoard[rowIndex][colIndex].toUpperCase()){
        return true;
      }
    }else{
      if(currentChessBoard[rowIndex][colIndex] == currentChessBoard[rowIndex][colIndex].toLowerCase()){
        return true;
      }
    }
    return false;
  };
  const CountPieces = (pieces) => {
    const points = {
      p: 1,
      P: 1,
      n: 3,
      N: 3,
      r: 3,
      R: 3,
      q: 9,
      Q: 9,
    };
    let totalPoints = 0;
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (points[piece]) {
        totalPoints += points[piece];
      }
    }
    return totalPoints;
  };
  const RenderCapturedPiecesText = memo(({ pieces }) => {
    let piecesNumber = CountPieces(pieces);
    if(piecesNumber === 0){return;}
    return (<Text style={styles.capturedPiece}>
      <Text style={styles.countColor}>{piecesNumber}:</Text>
      {pieces.map((piece, index) => (
        <Image
          key={index}
          source={chessPieceImages[piece]}
          style={styles.pieceIcon} // Define this style as needed
        />
      ))}
    </Text>);
  });
  const RenderText = ( rowIndex, colIndex) => {
    return useMemo(() => {
        if (colIndex === 0 && rowIndex > 0 && rowIndex < 9) {
            return <Text style={styles.cellText}>{`${rowIndex}`}</Text>;
        } else if (rowIndex === 0 || rowIndex === 9) {
            return <Text style={styles.borderCellText}>{`${String.fromCharCode(65 + colIndex)}`}</Text>;
        }
        return null;
    }, [rowIndex, colIndex]);
  };
  const RenderSquare = React.memo(({ rowIndex, colIndex, highLight }) => {
    if (rowIndex === 0 || rowIndex === 9) {
      return (
        <View style={[
          styles.cell,
          styles.borderCell]}>
          {RenderText(rowIndex, colIndex)}
          </View>
      );
    }
    if (highLight) {
      return (
        <View style={[
          styles.cell,
          ((rowIndex + colIndex) % 2 === 0) ? styles.whiteCellHighlight : styles.blackCellHighlight]}>
          {RenderText(rowIndex, colIndex)}
          {rowIndex !== 0 && rowIndex !== 15 && rowIndex <= currentChessBoard.length && (
            <RenderPieces piece={currentChessBoard[rowIndex - 1][colIndex]} style={styles.piece} />
          )}
        </View>
      );
    }
    return (
      <View style={[
        styles.cell,
        ((rowIndex + colIndex) % 2 === 0) ? styles.whiteCell : styles.blackCell]}>
        {RenderText(rowIndex, colIndex)}
        {rowIndex !== 0 && rowIndex !== 15 && rowIndex <= currentChessBoard.length && (
          <RenderPieces piece={currentChessBoard[rowIndex - 1][colIndex]} style={styles.piece} />
        )}
      </View>
    );
  });
  const RenderPieces = React.memo(({ piece, style }) => {
    if (piece == null) return null;
    return (
      <Image source={chessPieceImages[piece]} style={style} />
    );
  });

  const SelectPiece = (rowIndex,colIndex, testForStalemate = false, testForCheckmate = false) => {
    
    let tempKing = { // I use tempKing due to React's asynchronous nature
      whiteKingRow: king.whiteKingRow, 
      whiteKingCol: king.whiteKingCol, 
      blackKingRow: king.blackKingRow, 
      blackKingCol: king.blackKingCol 
    };
    
    if(!testForStalemate && testForCheckmate){
      
      if(CheckForLegality(currentChessBoard)){
        return true;
      }
      else{
        return false;
      }
    }
    if(highLightsArray[rowIndex-1][colIndex] && !testForStalemate){

      // MOVE PIECE
      if(selectedPiece.rowIndex == rowIndex && selectedPiece.colIndex == colIndex){
        return;
      }
      if(selectedPiece.type === "K"){
        setKing(prevState => ({
          ...prevState,
          whiteKingRow: rowIndex-1,
          whiteKingCol: colIndex,
        }));
      }else if(selectedPiece.type === "k"){
        setKing(prevState => ({
          ...prevState,
          blackKingRow: rowIndex-1,
          blackKingCol: colIndex,
        }));
      }
      const capturedPiece = currentChessBoard[rowIndex-1][colIndex];
      if(currentChessBoard[rowIndex-1][colIndex] != null){
        if(currentTurn){
          setBlackPiecesCaptured(prevState => {
            const newState = [...prevState, capturedPiece];
            return newState;
          });
        }else{
          setWhitePiecesCaptured(prevState => {
            const newState = [...prevState, capturedPiece];
            return newState;
          });
        }
      }
      let replacePieceWith = selectedPiece.type;
      // Promotion of pawns
      if(selectedPiece.type === "P" && rowIndex === 8){
        replacePieceWith = "Q";
      }else if(selectedPiece.type === "p" && rowIndex === 1){
        replacePieceWith = "q";
      }
      setCurrentTurn(prevState => !prevState);
      const newBoard = currentChessBoard.map((row => row.slice()));
      newBoard[selectedPiece.row-1][selectedPiece.col] = null;
      newBoard[rowIndex-1][colIndex] = replacePieceWith;
      setChessBoard(newBoard);
      // setChessBoard(prevState => {
      //     let newState = [...prevState];          
      //     newState[selectedPiece.row-1][selectedPiece.col] = null;
      //     newState[rowIndex-1][colIndex] = replacePieceWith;  
      //     //setCurrentTurn(prevTurn => !prevTurn);
      //     return newState;
      // });
      setHighLights(DEFAULT_HIGHLIGHTS);

      //Check for stalemate / chackmate
  
    } else if(currentChessBoard[rowIndex-1][colIndex]){

      // SELECT PIECE
      
      let chessPieceSelected = currentChessBoard[rowIndex-1][colIndex];
      
      //setHighLights(DEFAULT_HIGHLIGHTS);
      setSelectedPiece({
          row: rowIndex, 
          col: colIndex,  
          type: chessPieceSelected,
      });
      if(!testForStalemate && (chessPieceSelected == chessPieceSelected.toUpperCase()) != currentTurn){
        setHighLights(DEFAULT_HIGHLIGHTS);
        return newState;
      }
      let pieceColorWhite = (chessPieceSelected == chessPieceSelected.toUpperCase()) ? true : false;
      
      let newState = Array(8).fill(null).map(() => Array(4).fill(false));


      function CheckMoves(state, boardCopy, lastPiece, returnMove = false){
        
        let highlightsState = state;
        for(let i = 0; i < state.length; i++){
          for(let j = 0; j < state[i].length; j++){
            if(state[i][j]){
              
              let testState = JSON.parse(JSON.stringify(currentChessBoard));
              if(lastPiece === "K"){  
                tempKing.whiteKingRow = i;
                tempKing.whiteKingCol = j;
              }else if(lastPiece === "k"){
                tempKing.blackKingRow = i,
                tempKing.blackKingCol = j
              }
              
              testState[rowIndex-1][colIndex] = null;
              //console.log(`1. Before ${ selectedPiece.type}`);
              testState[i][j] = lastPiece;
              //console.log(`2. After ${currentChessBoard}`);
              
              if(!CheckForLegality(testState, tempKing)){
                highlightsState[i][j] = false;
              }
              else{
                highlightsState[i][j] = true;
                if(returnMove){
                  return true;
                }
              }
              
              //setCurrentTurn(prevTurn => !prevTurn);
              
            }
          }
        }
        if(returnMove){
          return false;
        }
        return highlightsState;
      }
      function CheckForLegality(testArray){
        let rowIdx = currentTurn ? tempKing.whiteKingRow : tempKing.blackKingRow;
        let colIdx = currentTurn ? tempKing.whiteKingCol : tempKing.blackKingCol;
        //First check for diagonals (queen)
        function legalityLoop(rowModifier, colModifier, maxSteps, checkForRooks = false){
          for (let i = 1; i <= maxSteps; i++) {
            const newRow = rowIdx + (i * rowModifier);
            const newCol = colIdx + (i * colModifier);
            // Check boundary conditions for both rows and columns
            if (newRow >= 0 && newRow < testArray.length && newCol >= 0 && newCol <= 3) {
              if (testArray[newRow][newCol] !== null) {
                if(i == 1 && (currentTurn ? testArray[newRow][newCol] === "k" : testArray[newRow][newCol] === "K")) return false;
                if((currentTurn ? testArray[newRow][newCol] === "q" : testArray[newRow][newCol] === "Q") || (checkForRooks && (currentTurn ? testArray[newRow][newCol] === "r" : testArray[newRow][newCol] === "R"))){
                  return false;
                }
                break;
              } 
              else{
                continue;
              }
            }else{
              break;
            }
          }
          return true;
        }
        function Portals(){
          let rowIdx = currentTurn ? tempKing.whiteKingRow : tempKing.blackKingRow;
          let colIdx = currentTurn ? tempKing.whiteKingCol : tempKing.blackKingCol;
          //Left D-->A
          if(colIdx === 3){
            for(let i = 0; i < 3; i++){
              if(testArray[rowIdx][i] !== null){
                if((currentTurn ? testArray[rowIdx][i] === "q" : testArray[rowIdx][i] === "Q") || (currentTurn ? testArray[rowIdx][i] === "r" : testArray[rowIdx][i] === "R")){
                  return false;
                }
                break;
              }
            }
            for(let i = 0; i < 7; i++){
              if(rowIdx+1+i > 7 || i > 3){break;}
              if(testArray[rowIdx+1+i][i] !== null){
                
                if(currentTurn ? testArray[rowIdx+1+i][i] === "q" : testArray[rowIdx+1+i][i] === "Q"){
                  return false;
                }
                break;
              }
            }
            for(let i = 0; i < 7; i++){
              if(rowIdx-1-i < 0 || i > 3){break;}
              if(testArray[rowIdx-1-i][i] !== null){
                
                if(currentTurn ? testArray[rowIdx-1-i][i] === "q" : testArray[rowIdx-1-i][i] === "Q"){
                  return false;
                }
                break;
              }
            }
          }
          // RIGHT a--> d
          if(colIdx === 0){
            for(let i = 3; i > 0; i--){
              if(testArray[rowIdx][i] !== null){
                if((currentTurn ? testArray[rowIdx][i] === "q" : testArray[rowIdx][i] === "Q") || (currentTurn ? testArray[rowIdx][i] === "r" : testArray[rowIdx][i] === "R")){
                  return false;
                }
                break;
              }
            }
            for(let i = 0; i < 6; i++){
              if(rowIdx+1+i > 7 || 3-i < 0){break;}
              if(testArray[rowIdx+1+i][3-i] !== null){
                if(currentTurn ? testArray[rowIdx+1+i][3-i] === "q" : testArray[rowIdx+1+i][3-i] === "Q"){
                  return false;
                }
                break;
              }
            }
            for(let i = 0; i < 6; i++){
              if(rowIdx-1-i < 0 || 3-i < 0){break;}
              
              if(testArray[rowIdx-1-i][3-i] !== null){
                if(currentTurn ? testArray[rowIdx-1-i][3-i] === "q" : testArray[rowIdx-1-i][3-i] === "Q"){
                  return false;
                }
                break;
              }
            }
          }
          return true;
        }
        function CheckIfInBoundries(desiredRow, desiredCol){
          if(desiredRow > 7 || desiredRow < 0){
            return true;
          }
          if(desiredCol < 0 || desiredCol > 3){
            if(currentChessBoard[desiredRow][desiredCol < 0 ? 3 : 0] !== null){
              if((currentTurn ? testArray[desiredRow][desiredCol] === "n" : testArray[desiredRow][desiredCol] === "N")){
                return false;
              }
            }
            return true;
          }
          if(currentChessBoard[desiredRow][desiredCol] !== null){
            if((currentTurn ? testArray[desiredRow][desiredCol] === "n" : testArray[desiredRow][desiredCol] === "N")){
              return false;
            }
            return true;
          }
          return true;
        }
        if(!Portals()) return false;

        if (!CheckIfInBoundries(rowIdx + 2, colIdx + 1)) return false;
        if (!CheckIfInBoundries(rowIdx + 2, colIdx - 1)) return false;

        if (!CheckIfInBoundries(rowIdx - 2, colIdx + 1)) return false;
        if (!CheckIfInBoundries(rowIdx - 2, colIdx - 1)) return false;

        if (!CheckIfInBoundries(rowIdx + 1, colIdx + 2)) return false;
        if (!CheckIfInBoundries(rowIdx - 1, colIdx + 2)) return false;

        if (!CheckIfInBoundries(rowIdx + 1, colIdx - 2)) return false;
        if (!CheckIfInBoundries(rowIdx - 1, colIdx - 2)) return false;
        //right-top movement
        if (!legalityLoop(1, 1, 7)) return false;
        //right-down movement
        if (!legalityLoop(1, -1, 7)) return false;
        //left-top movement
        if (!legalityLoop(-1, 1, 4)) return false;
        //right-down movement
        if (!legalityLoop(-1, -1, 4)) return false;
        // top movement
        if (!legalityLoop(1, 0, 7, true)) return false;
        // down movement
        if (!legalityLoop(-1, 0, 7, true)) return false;
        // right movement
        if (!legalityLoop(0, 1, 4, true)) return false;
        // left movement
        if (!legalityLoop(0, -1, 4, true)) return false;
        //Check for pawns
        if(currentTurn){
          //Check for black pawns
          let colIndexDiag = colIdx - 1;
          //console.log(`${testArray[rowIdx+1][colIndexDiag < 0 ? 3 : colIndexDiag]}`)
          if(testArray[rowIdx+1][colIndexDiag < 0 ? 3 : colIndexDiag] !== null && testArray[rowIdx+1][colIndexDiag < 0 ? 3 : colIndexDiag] === "p") 
          {
            return false;
          }
          colIndexDiag += 2;
          if(testArray[rowIdx+1][colIndexDiag > 3 ? 0 : colIndexDiag] !== null && testArray[rowIdx+1][colIndexDiag > 3 ? 0 : colIndexDiag] === "p") 
          {
            return false;
          }
        }else{
          let colIndexDiag = colIdx - 1;
          if(testArray[rowIdx-1][colIndexDiag < 0 ? 3 : colIndexDiag] !== null && testArray[rowIdx-1][colIndexDiag < 0 ? 3 : colIndexDiag] === "P") 
          {
            return false;
          }
          colIndexDiag += 2;
          if(testArray[rowIdx-1][colIndexDiag > 3 ? 0 : colIndexDiag] !== null && testArray[rowIdx-1][colIndexDiag > 3 ? 0 : colIndexDiag] === "P") 
          {
            return false;
          }
        }
        return true;
      }
      function updateStateForDirection(rowModifier, colModifier, maxSteps) {
        for (let i = 1; i <= maxSteps; i++) {
          const newRow = rowIndex - 1 + (i * rowModifier);
          const newCol = colIndex + (i * colModifier);
          
          // Check boundary conditions for both rows and columns
          if (newRow >= 0 && newRow < currentChessBoard.length && newCol >= 0 && newCol <= 3) {
            
            if (currentChessBoard[newRow][newCol] !== null) {
              if (CheckForEnemyPiece(newRow, newCol, pieceColorWhite)) {
                newState[newRow][newCol] = true;
              }
              break;
            } 
            else{
              newState[newRow][newCol] = true;
            }
          }
          else if (newRow >= 0 && newRow < currentChessBoard.length){
            // PORTAL
            if (currentChessBoard[newRow][newCol < 0 ? 3 : 0] !== null) {
              if (CheckForEnemyPiece(newRow, newCol < 0 ? 3 : 0, pieceColorWhite)) {
                newState[newRow][newCol < 0 ? 3 : 0] = true;
              }else{
                break;
              }
            } 
            newState[newRow][newCol < 0 ? 3 : 0] = true;
            break;
          }else{
            break;
          }
          
        }
      }

      let colIndexDiag;
      switch(chessPieceSelected){
          case "P":
            // White pawns move one or two squares, or attack piece diagonally
            colIndexDiag = colIndex - 1;
            if(CheckForEnemyPiece(rowIndex,colIndexDiag < 0 ? 3 : colIndexDiag,pieceColorWhite)) 
            {
                newState[rowIndex][colIndexDiag < 0 ? 3 : colIndexDiag] = true;
            }
            colIndexDiag += 2;
            if(CheckForEnemyPiece(rowIndex,colIndexDiag > 3 ? 0 : colIndexDiag,pieceColorWhite)) 
            {
                newState[rowIndex][colIndexDiag > 3 ? 0 : colIndexDiag] = true;
            }
            
            // Normal movement
            if (rowIndex === 2) {
                for (let i = 1; i <= 2; i++) {
                    if (currentChessBoard[rowIndex - 1 + i][colIndex] !== null) {
                        break;
                    }
                    newState[rowIndex - 1 + i] = [...newState[rowIndex - 1 + i]];
                    newState[rowIndex - 1 + i][colIndex] = true;
                }
                
            } else {
                if (currentChessBoard[rowIndex][colIndex] === null) {
                    newState[rowIndex] = [...newState[rowIndex]];
                    newState[rowIndex][colIndex] = true;
                }
            }
            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
            
            break;
          case "p":
            // Black pawns move one or two squares, or attack piece diagonally
            colIndexDiag = colIndex - 1;
            if(CheckForEnemyPiece(rowIndex-2,colIndexDiag < 0 ? 3 : colIndexDiag,pieceColorWhite)) 
            {
                newState[rowIndex-2][colIndexDiag < 0 ? 3 : colIndexDiag] = true;
            }
            colIndexDiag += 2;
            if(CheckForEnemyPiece(rowIndex-2,colIndexDiag > 3 ? 0 : colIndexDiag,pieceColorWhite)) 
            {
                newState[rowIndex-2][colIndexDiag > 3 ? 0 : colIndexDiag] = true;
            }
          
            
            // Normal movement
            if (rowIndex === 7) {
                for (let i = 1; i <= 2; i++) {
                    if (currentChessBoard[rowIndex - 1 - i][colIndex] !== null) {
                        break;
                    }
                    newState[rowIndex - 1 - i] = [...newState[rowIndex - 1 - i]];
                    newState[rowIndex - 1 - i][colIndex] = true;
                }
                
            } else {
                if (currentChessBoard[rowIndex-2][colIndex] === null) {
                    newState[rowIndex-2] = [...newState[rowIndex-2]];
                    newState[rowIndex-2][colIndex] = true;
                }
            }
            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
            break;
          case "r":
          case "R":
            // Rook moves in cardinal directions
            // top movement
            updateStateForDirection(1, 0, 7);
            // down movement
            updateStateForDirection(-1, 0, 7);
            // right movement
            updateStateForDirection(0, 1, 4);
            // left movement
            updateStateForDirection(0, -1, 4);
            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
            break;
          case "q":
          case "Q":
            // Queen moves both in cardinal directions and diagonally
            // top movement
            updateStateForDirection(1, 0, 7);
            // down movement
            updateStateForDirection(-1, 0, 7);
            // right movement
            updateStateForDirection(0, 1, 4);
            // left movement
            updateStateForDirection(0, -1, 4);

            //right-top movement
            updateStateForDirection(1, 1, 7);
            //right-down movement
            updateStateForDirection(1, -1, 7);
            //left-top movement
            updateStateForDirection(-1, 1, 4);
            //right-down movement
            updateStateForDirection(-1, -1, 4);
            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
            break;
          case "n":
          case "N":
            function CheckIfInBoundries(desiredRow, desiredCol){
              if(desiredRow > 7 || desiredRow < 0){
                return;
              }
              if(desiredCol < 0 || desiredCol > 3){
                if(currentChessBoard[desiredRow][desiredCol < 0 ? 3 : 0] !== null){
                  if(!CheckForEnemyPiece(desiredRow,desiredCol,pieceColorWhite)){
                    return;
                  }
                }
                newState[desiredRow][desiredCol < 0 ? 3 : 0] = true;
              }
              if(currentChessBoard[desiredRow][desiredCol] !== null){
                if(CheckForEnemyPiece(desiredRow,desiredCol,pieceColorWhite)){
                  newState[desiredRow][desiredCol] = true;
                }
                return;
              }
              newState[desiredRow][desiredCol] = true;
            }

            CheckIfInBoundries(rowIndex - 1 + 2, colIndex + 1);
            CheckIfInBoundries(rowIndex - 1 + 2, colIndex - 1);

            CheckIfInBoundries(rowIndex - 1 - 2, colIndex + 1);
            CheckIfInBoundries(rowIndex - 1 - 2, colIndex - 1);

            CheckIfInBoundries(rowIndex - 1 + 1, colIndex + 2);
            CheckIfInBoundries(rowIndex - 1 - 1, colIndex + 2);

            CheckIfInBoundries(rowIndex - 1 + 1, colIndex - 2);
            CheckIfInBoundries(rowIndex - 1 - 1, colIndex - 2);

            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
          break;
          case "k":
          case "K":
            // top movement
            updateStateForDirection(1, 0, 1);
            // down movement
            updateStateForDirection(-1, 0, 1);
            // right movement
            updateStateForDirection(0, 1, 1);
            // left movement
            updateStateForDirection(0, -1, 1);

            //right-top movement
            updateStateForDirection(1, 1, 1);
            //right-down movement
            updateStateForDirection(1, -1, 1);
            //left-top movement
            updateStateForDirection(-1, 1, 1);
            //right-down movement
            updateStateForDirection(-1, -1, 1);
            if(!testForStalemate){
              setHighLights((prevState) => {
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
              });
            }else{
              return CheckMoves(newState, currentChessBoard, chessPieceSelected, true);
            }
            break;
      } 
    }
  }
  const [isForfeitModalVisible, setIsForfeitModalVisible] = useState(false);
  const ForfeitButton = () => {
    ResetBoard();
    setIsForfeitModalVisible(false);
  }
  const ForfeitModal = () => {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={isForfeitModalVisible}
      onRequestClose={() => setIsForfeitModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Are you sure you want to forfeit?</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={ForfeitButton}>
              <Text style={styles.modalButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setIsForfeitModalVisible(false)}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    );
  }
  const [isCheckMateModalVisible, setIsCheckMateModalVisible] = useState(false);
  const closeCheckMateModal = () => setIsCheckMateModalVisible(false);
  const CheckMateButton = () => {
    ResetBoard();
    closeCheckMateModal();
  }
  const CheckMateModal = () => {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={isCheckMateModalVisible}
      onRequestClose={closeCheckMateModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>CheckMate!</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={CheckMateButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  const [isStaleMateModalVisible, setIsStaleMateModalVisible] = useState(false);
  const closeStaleMateModal = () => setIsStaleMateModalVisible(false);
  const StaleMateButton = () => {
    ResetBoard();
    closeStaleMateModal();
  }
  const StaleMateModal = () => {
    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={isStaleMateModalVisible}
      onRequestClose={closeStaleMateModal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>CheckMate!</Text>
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={StaleMateButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
  const { rotateBoard, darkMode } = useContext(SettingsContext);
  function PlayChess() {
    if(!rotateBoard){
      return (
        
        <View style={darkMode ? styles.container : styles.LightContainer}>
          <ForfeitModal/>
          <CheckMateModal/>
          <StaleMateModal/>
          {currentTurn ? <Text style={styles.roundText}>White's turn</Text>: <Text style={styles.roundText}>Black's turn</Text> }
          <RenderCapturedPiecesText pieces={blackPiecesCaptured} />
          <View style={styles.boardContainer}>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => handlePress(rowIndex, colIndex)}
                    >
                      <RenderSquare rowIndex={rowIndex} colIndex={colIndex} highLight={rowIndex === 0 || rowIndex === 9 ? null : highLightsArray[rowIndex - 1][colIndex]}/>
                    </TouchableOpacity>
                ))}
                </View>
            ))}
            <RenderCapturedPiecesText pieces={whitePiecesCaptured} />
          </View>
        </View>
      );
    }else{
      if(currentTurn){
        return (
          <View style={darkMode ? styles.container : styles.LightContainer}>
          <ForfeitModal/>
          <CheckMateModal/>
          <StaleMateModal/>
          {currentTurn ? <Text style={styles.roundText}>White's turn</Text>: <Text style={styles.roundText}>Black's turn</Text> }
          <RenderCapturedPiecesText pieces={whitePiecesCaptured} />
          <View style={styles.boardContainer}>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <View key={9-rowIndex} style={styles.row}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => handlePress(9-rowIndex, colIndex)}
                    >
                      <RenderSquare rowIndex={9-rowIndex} colIndex={colIndex} highLight={9-rowIndex === 0 || 9-rowIndex === 9 ? null : highLightsArray[9-rowIndex - 1][colIndex]}/>
                    </TouchableOpacity>
                ))}
                </View>
            ))}
            <RenderCapturedPiecesText pieces={blackPiecesCaptured} />
          </View>
        </View>
        );
      }
      else{
        return (
          <View style={darkMode ? styles.container : styles.LightContainer}>
          <ForfeitModal/>
          <CheckMateModal/>
          <StaleMateModal/>
          {currentTurn ? <Text style={styles.roundText}>White's turn</Text>: <Text style={styles.roundText}>Black's turn</Text> }
          <RenderCapturedPiecesText pieces={blackPiecesCaptured} />
          <View style={styles.boardContainer}>
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => handlePress(rowIndex, colIndex)}
                    >
                      <RenderSquare rowIndex={rowIndex} colIndex={colIndex} highLight={rowIndex === 0 || rowIndex === 9 ? null : highLightsArray[rowIndex - 1][colIndex]}/>
                    </TouchableOpacity>
                ))}
                </View>
            ))}
            <RenderCapturedPiecesText pieces={whitePiecesCaptured} />
          </View>
        </View>
        );
      }
    }
  }
  function Settings(){
    return(<SettingsMenu></SettingsMenu>);
  }
  const Tab = createBottomTabNavigator();
  return (
    
    <View style={{flex:1}}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              
              if (route.name === 'Forfeit') {
                iconName = focused ? 'flag' : 'flag-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'build' : 'build-outline';
              }else if (route.name === 'Play') {
                iconName = focused ? 'cube' : 'cube-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false, // hide the top bar
            tabBarActiveTintColor: darkMode ? 'white' : '#d6b892',
            tabBarInactiveTintColor: darkMode ? 'lightgray' :'gray',
            tabBarStyle: {
              backgroundColor: darkMode ? '#242424' : 'white',
              display: 'flex',
              flexDirection: 'row', // Ensures items are laid out in a row
              justifyContent: 'space-evenly', // Distributes space evenly
            },
          })}
          safeAreaInsets={{ top: 0, bottom: 0 }}
        >
          <Tab.Screen 
          name="Play" 
          component={PlayChess} 
        />
          <Tab.Screen 
          name="Settings" 
          component={Settings} 
        />
          <Tab.Screen
            name="Forfeit"
            component={DummyComponent}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                // Prevent default action (which is navigating to the tab)
                e.preventDefault();

                // Call your function here
                console.log('Forfeit button pressed');
                setIsForfeitModalVisible(true);

                // If you also need to navigate somewhere else, you can do it like this:
                // navigation.navigate('SomeOtherRoute');
              },
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
  </View>
    
    
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
    },
    LightContainer: {
      flex: 1,
      backgroundColor: '#f7f7f7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    forfeitButton: {
      marginTop: 20,
      height: 70,
      backgroundColor: 'black',
    },
    forfeitButtonText: {
      color: 'white',
      fontSize: 21,
      textAlign: 'center',
      fontWeight: 'bold',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    blackCell: {
      backgroundColor: '#242424',
      justifyContent: 'center',
      alignItems: 'center',
    },
    whiteCellHighlight: {
      //backgroundColor: '#edc200',
      backgroundColor: '#faf3eb',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blackCellHighlight: {
      backgroundColor: '#737373',
      justifyContent: 'center',
      alignItems: 'center',
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
      width: '94%', // or another percentage or fixed size to scale the image
      height: '94%', // or another percentage or fixed size to scale the image
      resizeMode: 'contain', // this makes sure the image scales within the square
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
    pieceIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      borderColor: 'white', // Set border color to white
      borderWidth: 2, // Set border width, adjust as needed
      borderRadius: 15, // Optional: to make the border rounded
    },
  
    //Modal
    modal: {
      position: 'absolute', // Position the modal absolutely
        width: '100%',        // Cover the entire screen width
        height: '100%',       // Cover the entire screen height
        justifyContent: 'center', // Center vertically
        alignItems: 'center',     // Center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
      width: '80%',
        padding: 20,
        backgroundColor: '#242424',
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center', // Center the content within the modal
    },
    modalText: {
      marginBottom: 15,
      color: 'white',
      fontWeight: 'bold',
      textAlign: "center"
    },
    modalButton: {
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 5,
      margin: 5,
      alignItems: 'center',
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalButtonText: {
      color: 'white',
    }
  });
export default ChessBoard;