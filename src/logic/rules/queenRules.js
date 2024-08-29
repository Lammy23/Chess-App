import { allChessCoordinates, Color } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

export function queenMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  // Logic is the combination of a Rook and a Bishop
  if (currentFile === previousFile) {
    // Vertical Movement
    for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
      if (
        this.tileIsOccupied(
          currentFile,
          Math.min(currentRank, previousRank) + i,
          boardState
        )
      ) {
        return false;
      }
    }
  } else if (currentRank === previousRank) {
    // Horizontal Movement
    for (let i = 1; i < Math.abs(currentFileNumber - previousFileNumber); i++) {
      if (
        this.tileIsOccupied(
          this.numberToFile(
            Math.min(currentFileNumber, previousFileNumber) + i
          ),
          currentRank,
          boardState
        )
      ) {
        return false;
      }
    }
  } else if (
    Math.abs(currentFileNumber - previousFileNumber) ===
    Math.abs(currentRank - previousRank)
  ) {
    // Diagonal Movement
    let verticalDirection = previousRank < currentRank ? 1 : -1;
    let counter = 0 + verticalDirection;
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
      counter += verticalDirection;
    }
  } else {
    return false;
  }
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

export function possibleQueenMoves({ futureBoardState, teamColour }) {
  var color = Color.getLetter(teamColour)

  // 1. Get queen coordinates
  let queenCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `queen_${color}`) {
      queenCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate moves. Queen moves in eight directions
  let moveList = [];
  const moveMap = [];

  queenCoordinates.forEach((cdn) => {
    moveList.push(...this.getPossibleCrossMoves(cdn).moveList);
    moveMap.push(...this.getPossibleCrossMoves(cdn).moveMap);
    moveList.push(...this.getPossibleDiagonalMoves(cdn).moveList);
    moveMap.push(...this.getPossibleDiagonalMoves(cdn).moveMap)
  });

  //TODO: printing the below gives wierd results. Fix them.
  // console.log(teamColour)
  // console.log(moveMap)

  return { moveList: moveList, moveMap: moveMap };
}
