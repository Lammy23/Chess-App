import { allChessCoordinates } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

export function bishopMove({
  previousRank,
  currentRank,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  //The difference in files MUST BE SAME as difference in ranks for a valid bishop move
  if (
    Math.abs(currentFileNumber - previousFileNumber) ===
    Math.abs(currentRank - previousRank)
  ) {
    // The two lines below handle whether or not the bishop is going up or down a path
    let verticalDirection = previousRank < currentRank ? 1 : -1;
    let counter = 0 + verticalDirection;
    // Need to check whether or not bishop is going left or right
    for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
      if (previousFileNumber > currentFileNumber) {
        //Left
        if (
          this.tileIsOccupied(
            this.numberToFile(previousFileNumber - i),
            previousRank + counter,
            boardState
          )
        ) {
          console.log(
            this.numberToFile(previousFileNumber - i),
            previousRank + counter
          );
          return false;
        }
      } else {
        //Right
        if (
          this.tileIsOccupied(
            this.numberToFile(previousFileNumber + i),
            previousRank + counter,
            boardState
          )
        ) {
          return false;
        }
      }
      counter += verticalDirection; // + or - one for each tile depending on vertical direction
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
  } else {
    return false;
  }
}

export function possibleBishopMoves({ futureBoardState, teamColour }) {
  var color = teamColour === "WHITE" ? "w" : "b";

  // 1. Get bishop coordinates
  let bishopCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `bishop_${color}`) {
      bishopCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate moves. Bishop moves in four directions
  let moveList = [];
  const moveMap = [];

  bishopCoordinates.forEach((cdn) => {
    moveList.push(...this.getPossibleDiagonalMoves(cdn).moveList);
    moveMap.push(...this.getPossibleDiagonalMoves(cdn).moveMap)
  });

  return { moveList: moveList, moveMap: moveMap };
}
