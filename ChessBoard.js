import React, { useMemo, useEffect  } from 'react';
import { useState, memo } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const ChessBoard = () => {

  //TURN True = White, False = Black
  const [currentTurn, setCurrentTurn] = useState(true);
  const hideNavigationBar = async () => {
    // Setting the visibility status of the Navigation Bar to "hidden".
    await NavigationBar.setVisibilityAsync("hidden");
  };

  const handlePress = (row, col) => {
    hideNavigationBar();
    if(col >= 0 && col <= 4 && row >= 1 && row <= 8){
      SelectPiece(row, col)
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
        console.log("Stalemate");
      }
    } 
    if (!CheckChessBoard(currentTurn)) {
      if(!SelectPiece(0,0,false,true)){
        console.log("Checkmate!");
        return;
      }else{
        console.log("Stalemate");
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
      <Text style={styles.countColor}>{piecesNumber}:</Text> {pieces.join(", ")}
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
  const RenderSquare = ( rowIndex, colIndex, highlights) => {
    return useMemo(() => {
        if (rowIndex === 0 || rowIndex === 9) {
        return styles.borderCell;
        } 
        if(highLightsArray[rowIndex-1][colIndex]){
        return ((rowIndex + colIndex) % 2 === 0) ? styles.whiteCellHighlight : styles.blackCellHighlight;
        }

        return ((rowIndex + colIndex) % 2 === 0) ? styles.whiteCell : styles.blackCell;
    }, [rowIndex, colIndex, highlights]);
  };
  const RenderPieces = (rowIndex, colIndex) => {
    if (rowIndex === 0 || rowIndex === 15 || rowIndex > currentChessBoard.length) {
        return null
    }

    const piece = currentChessBoard[rowIndex-1][colIndex];

    if (piece) {
        return <Text style={styles.piece}>{piece}</Text>;
    }

    return null;
  };
  
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
      setChessBoard(prevState => {
          let newState = [...prevState];          
          newState[selectedPiece.row-1][selectedPiece.col] = null;
          newState[rowIndex-1][colIndex] = replacePieceWith;  
          //setCurrentTurn(prevTurn => !prevTurn);
          return newState;
      });
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
  return (
    
    
    <View>
      
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
            <View
              
              style={[
                styles.cell,
                RenderSquare(rowIndex, colIndex, highLightsArray)
                
              ]}
            >
            {RenderText(rowIndex, colIndex)}
            {RenderPieces(rowIndex, colIndex)}
            </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
    <RenderCapturedPiecesText pieces={whitePiecesCaptured} />
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
export default ChessBoard;