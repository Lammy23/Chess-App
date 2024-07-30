import { allChessCoordinates } from "../../components/constants";
import { ChessCoordinates } from "../Coordinates";

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

export function PossibleKnightMoves({ futureBoardState, teamColour }) {
  // Get current coordinates
  // Calculate all possible cordinates according to knight rules
  // add coordinates to list and return

  var knightCoordinates = [];
  var color = teamColour === "WHITE" ? "w" : "b";

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `knight_${color}`) {
      knightCoordinates.push(coordinate);
    }
  }

  const moves = [];

  knightCoordinates = knightCoordinates.map((coordinate) => {
    return new ChessCoordinates(coordinate);
  });

  // eaargghh
  let x = [2, 2, -2, -2];
  let y = [-1, 1, -1, 1];

  const f = (coordinate) => {
    for (let i = 0; i < x.length; i++) {
      let a = coordinate.plusVal({ fileStep: x[i], rankStep: y[i] });
      let b = coordinate.plusVal({ rankStep: x[i], fileStep: y[i] });

      if (a && !this.tileIsOccupiedByOwn(a, futureBoardState)) moves.push(a);
      if (b && !this.tileIsOccupiedByOwn(b, futureBoardState)) moves.push(b);
    }
  };

  knightCoordinates.forEach((coordinate) => {
    f(coordinate);
  });

  console.log(moves);
  return moves;
}
