import { allChessCoordinates, numToFile } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

export function kingMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  //SUGGESTION: This code is very iffy lol, refactor afterwards
  if (     // Diagonal Movement
    Math.abs(currentFileNumber - previousFileNumber) === 1 &&
    Math.abs(currentRank - previousRank) === 1
  ) {
  } else if (     // Vertical Movement
    Math.abs(currentRank - previousRank) === 1 &&
    previousFile === currentFile
  ) {
  } else if (     // Horizontal Movement
    Math.abs(currentFileNumber - previousFileNumber) === 1 &&
    previousRank === currentRank
  ) { 
  } else if( // King side Castling
    currentFileNumber - previousFileNumber === 2 && 
    currentRank === 7 // need to change to make it work for both black and white
  ) { 
    boardState[`${numToFile(currentFileNumber + 1)}${currentRank}`] = boardState[`${numToFile(currentFileNumber - 2)}${currentRank}`]
  } else if( // Queen side Castling
    currentFileNumber - previousFileNumber === -2 &&
    currentRank === 7
  ) { 
  } else {
    return false;

  }
  // If it is occupied, then it must be either the same or opposing colour
  if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
    return true;
  } else if (
    this.tileIsOccupiedByOpponent(
      currentFile,
      currentRank,
      boardState,
      teamColour
    )
  ) {
    return true;
  }
}

export function possibleKingMoves({ futureBoardState, teamColour }) {
  var color = teamColour === "WHITE" ? "w" : "b";

  // 1. Get king coordinates
  var kingCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `king_${color}`) {
      kingCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate king moves

  const moveList = [];
  const moveMap = [];

  /**
   *
   * @param {ChessCoordinate} coordinate
   */
  const check = (coordinate) => {
    let origin = coordinate.coordinate;

    const x = [-1, 0, 1]; // File
    const y = [1, 0, -1]; // Rank

    for (let file of x) {
      for (let rank of y) {
        if (
          coordinate.plus({ fileStep: file, rankStep: rank }).coordinate !==
          origin
        ) {
          if (
            !coordinate.isOccupied({ futureBoardState }) ||
            coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })
          ) {
            moveList.push(coordinate.coordinate);
            moveMap.push({
              from: origin,
              to: coordinate.coordinate,
            });
          }
        }
        coordinate.setCoordinate(origin);
      }
    }
  };

  for (let coordinate of kingCoordinates) {
    check(coordinate);
  }

  return { moveList: moveList, moveMap: moveMap };
}

export function castling() {
  
}