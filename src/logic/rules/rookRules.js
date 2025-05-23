import { allChessCoordinates, Color } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

export function rookMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  // Must stay in the same file or same rank for movement
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
  } else {
    // if it doesn't enter any of the if else blocks,
    // it means the move it made does not follow the piece's logic type
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

export function possibleRookMoves({ futureBoardState, teamColour }) {
  var color = Color.getLetter(teamColour)

  // 1. Get rook coordinates
  let rookCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `rook_${color}`) {
      rookCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate moves. Rook moves in four directions
  let moveList = [];
  const moveMap = [];

  rookCoordinates.forEach((cdn) => {
    moveList.push(...this.getPossibleCrossMoves(cdn).moveList);
    moveMap.push(...this.getPossibleCrossMoves(cdn).moveMap);
  });

  return { moveList: moveList, moveMap: moveMap };
}
