import React, { useMemo } from 'react';
import { useState, memo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function App() {
  return (
    <View style={styles.container}>
      <ChessBoard />
      <StatusBar style="auto" />
    </View>
  );
}

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


  const handlePress = (row, col) => {
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

  let whiteKingRow = 0;
  let whiteKingCol = 2;
  let blackKingRow = 7;
  let blackKingCol = 2;

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
  
  const SelectPiece = (rowIndex,colIndex) => {
    
    if(highLightsArray[rowIndex-1][colIndex]){

      // MOVE PIECE
      if(selectedPiece.rowIndex == rowIndex && selectedPiece.colIndex == colIndex){
        return;
      }

      setCurrentTurn(prevState => !prevState);

      setChessBoard(prevState => {
          let newState = [...prevState];          
          newState[selectedPiece.row-1][selectedPiece.col] = null;
          newState[rowIndex-1][colIndex] = selectedPiece.type;  
          //setCurrentTurn(prevTurn => !prevTurn);
          return newState;
      });
      setHighLights(DEFAULT_HIGHLIGHTS);
  
    } else if(currentChessBoard[rowIndex-1][colIndex]){

      // SELECT PIECE

      let chessPieceSelected = currentChessBoard[rowIndex-1][colIndex];
        
      //setHighLights(DEFAULT_HIGHLIGHTS);
      setSelectedPiece({
          row: rowIndex, 
          col: colIndex,  
          type: chessPieceSelected,
      });
      
      if((chessPieceSelected == chessPieceSelected.toUpperCase()) != currentTurn){
        setHighLights(DEFAULT_HIGHLIGHTS);
        return newState;
      }

      let pieceColorWhite = (chessPieceSelected == chessPieceSelected.toUpperCase()) ? true : false;
      
      let newState = Array(8).fill(null).map(() => Array(4).fill(false));
      function CheckMoves(state, boardCopy, lastPiece){
        let highlightsState = state;
        for(let i = 0; i < state.length; i++){
          for(let j = 0; j < state[i].length; j++){
            if(state[i][j]){
              
              let testState = JSON.parse(JSON.stringify(currentChessBoard));
              
              
              testState[rowIndex-1][colIndex] = null;
              //console.log(`1. Before ${ selectedPiece.type}`);
              testState[i][j] = lastPiece;
              //console.log(`2. After ${currentChessBoard}`);
              
              if(!CheckForLegality(testState)){
                highlightsState[i][j] = false;
              }
              else{
                highlightsState[i][j] = true;
              }
              
              //setCurrentTurn(prevTurn => !prevTurn);
              
            }
          }
        }
        return highlightsState;
      }
      function CheckForLegality(testArray){
        let rowIdx = currentTurn ? whiteKingRow : blackKingRow;
        let colIdx = currentTurn ? whiteKingCol : blackKingCol;
        //First check for diagonals (queen)
        function legalityLoop(rowModifier, colModifier, maxSteps, checkForRooks = false){
          for (let i = 1; i <= maxSteps; i++) {
            const newRow = rowIdx + (i * rowModifier);
            const newCol = colIdx + (i * colModifier);
            
            // Check boundary conditions for both rows and columns
            if (newRow >= 0 && newRow < testArray.length && newCol >= 0 && newCol <= 3) {
              console.log(`${rowModifier} ${newRow} ${newCol} ${testArray[newRow][newCol] }`);
              if (testArray[newRow][newCol] !== null) {
                if((currentTurn ? testArray[newRow][newCol] === "q" : testArray[newRow][newCol] === "Q") || (checkForRooks && (currentTurn ? testArray[newRow][newCol] === "r" : testArray[newRow][newCol] === "R"))){
                  return false;
                }
                break;
              } 
              else{
                continue;
              }
            }
            else if (newRow >= 0 && newRow < testArray.length){
              // PORTAL
              if (testArray[newRow][newCol < 0 ? 3 : 0] !== null) {
                if((currentTurn ? testArray[newRow][newCol] === "q" : testArray[newRow][newCol] === "Q") || (checkForRooks && (currentTurn ? testArray[newRow][newCol] === "r" : testArray[newRow][newCol] === "R"))){
                  return false;
                }else{
                  break;
                }
              } 
              continue;
            }else{
              break;
            }
          }
          return true;
        }
        console.log("NEW TEST");
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

      switch(chessPieceSelected){
          case "P":
            // White pawns move one or two squares, or attack piece diagonally
            setHighLights((prevState) => {
              

                let colIndexDiagL = colIndex - 1;
                if(colIndexDiagL < 0){
                    colIndexDiagL = 3;
                }
                
                if(CheckForEnemyPiece(rowIndex,colIndexDiagL,pieceColorWhite)) // Weird way to check for black pieces
                {
                    
                    newState[rowIndex][colIndexDiagL] = true;
                }

                let colIndexDiagR = colIndex + 1;
                if(colIndexDiagR > 3){
                    colIndexDiagR = 0;
                }
                
                if(CheckForEnemyPiece(rowIndex,colIndexDiagR,pieceColorWhite)) // Weird way to check for black pieces
                {
                    newState[rowIndex][colIndexDiagR] = true;
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
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
            });
            break;
          case "p":
            // Black pawns move one or two squares, or attack piece diagonally
            setHighLights((prevState) => {
                

                let colIndexDiagL = colIndex - 1;
                if(colIndexDiagL < 0){
                    colIndexDiagL = 3;
                }

                if(CheckForEnemyPiece(rowIndex-2,colIndexDiagL,pieceColorWhite)) // Weird way to check for black pieces
                {
                    
                    newState[rowIndex-2][colIndexDiagL] = true;
                }

                let colIndexDiagR = colIndex + 1;
                if(colIndexDiagR > 3){
                    colIndexDiagR = 0;
                }
                
                if(CheckForEnemyPiece(rowIndex-2,colIndexDiagR,pieceColorWhite)) // Weird way to check for black pieces
                {
                    
                    newState[rowIndex-2][colIndexDiagR] = true;
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
                
                return CheckMoves(newState, currentChessBoard, chessPieceSelected);
            });
            break;
          case "r":
          case "R":
            // Rook moves in cardinal directions
            setHighLights((prevState) => {
              // top movement
              updateStateForDirection(1, 0, 7);
              // down movement
              updateStateForDirection(-1, 0, 7);
              // right movement
              updateStateForDirection(0, 1, 4);
              // left movement
              updateStateForDirection(0, -1, 4);
              return CheckMoves(newState, currentChessBoard, chessPieceSelected);
            });
            break;
          case "q":
          case "Q":
            // Queen moves both in cardinal directions and diagonally
            setHighLights((prevState) => {
               
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
              return CheckMoves(newState, currentChessBoard, chessPieceSelected);
            });
            break;
          case "n":
          case "N":
            setHighLights((prevState) => {
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

              return CheckMoves(newState, currentChessBoard, chessPieceSelected);
          });
          break;
      } 
    }
  }
  return (
    
    <View>
      {currentTurn ? <Text>White's turn</Text>: <Text>Black's turn</Text> }
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
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  }
});

