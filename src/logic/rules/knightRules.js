import { allChessCoordinates, Color } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

// #TODO: can prolly use private variable refContext instead of
export function knightMove({
  previousRank,
  currentRank,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  // Checking for 'L' shape movement.
  // #SUGGESTION: Conditions like these can condense the code
  let verticalL =
    Math.abs(currentRank - previousRank) === 2 &&
    Math.abs(currentFileNumber - previousFileNumber) === 1;
  let horizontalL =
    Math.abs(currentFileNumber - previousFileNumber) === 2 &&
    Math.abs(currentRank - previousRank) === 1;

  if (verticalL || horizontalL) {
    if (this.tileIsOccupied(currentFile, currentRank, boardState)) {
      if (
        this.tileIsOccupiedByOpponent(
          currentFile,
          currentRank,
          boardState,
          teamColour
        )
      ) {
        return true;
      }
      return false;
    }
    return true;
  }
}

export function possibleKnightMoves({ futureBoardState, teamColour }) {
  var color = Color.getLetter(teamColour);

  // 1. Get knight coordinates
  var knightCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `knight_${color}`) {
      knightCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate knight moves.
  let moveList = [];
  const moveMap = [];

  // possible knight moves
  let x = [2, 2, -2, -2];
  let y = [-1, 1, -1, 1];

  /**
   *
   * @param {ChessCoordinate} coordinate
   */
  const f = (coordinate) => {
    let origin = coordinate.coordinate;

    for (let i = 0; i < x.length; i++) {
      coordinate.plus({ fileStep: x[i], rankStep: y[i] });
      if (coordinate.coordinate !== origin) {
        if (
          !coordinate.isOccupied(futureBoardState) ||
          coordinate.isOccupiedByOpponent(futureBoardState, teamColour)
        ) {
          moveList.push(coordinate.coordinate);
          moveMap.push({
            from: origin,
            to: coordinate.coordinate,
          });        }
      }

      coordinate.setCoordinate(origin);

      coordinate.plus({ rankStep: x[i], fileStep: y[i] });
      if (coordinate.coordinate !== origin) {
        if (
          !coordinate.isOccupied(futureBoardState) ||
          coordinate.isOccupiedByOpponent(futureBoardState, teamColour)
        ) {
          moveList.push(coordinate.coordinate);
          moveMap.push({
            from: origin,
            to: coordinate.coordinate,
          });        }
      }

      coordinate.setCoordinate(origin);
    }
  };

  knightCoordinates.forEach((coordinate) => {
    f(coordinate);
  });

  return { moveList: moveList, moveMap: moveMap };
}
