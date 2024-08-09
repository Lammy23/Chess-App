import { files } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

export function pawnMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
  moveHistory,
}) {
  // Below 2 lines are for if its a white or black pawn
  const specialRank = teamColour === "WHITE" ? 2 : 7;
  const pawnDirection = teamColour === "WHITE" ? 1 : -1;

  if (
    previousRank === specialRank &&
    currentRank - previousRank === 2 * pawnDirection &&
    previousFile === currentFile
  ) {
    if (
      !this.tileIsOccupied(
        currentFile,
        currentRank - pawnDirection,
        boardState
      ) &&
      !this.tileIsOccupied(currentFile, currentRank, boardState)
    ) {
      // Pawn direction depending on black or white will do either +1 or -1
      return true;
    }
  } else if (
    currentRank - previousRank === pawnDirection &&
    previousFile === currentFile
  ) {
    // Can treat the move as isNotAFirstMove if the pawn decides it wants to go 1 tile instead of 2 on its first move
    if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
      return true;
    }
    // ATTACKING LOGIC
  } else if (
    currentRank - previousRank === pawnDirection &&
    Math.abs(currentFileNumber - previousFileNumber) === 1
  ) {
    //If a piece is in the diagonal, it will be allowed to attack, otherwise it won't
    if (
      this.tileIsOccupied(currentFile, currentRank, boardState) &&
      this.tileIsOccupiedByOpponent(
        currentFile,
        currentRank,
        boardState,
        teamColour
      )
    ) {
      return true;
    } else if (
      this.isValidEnPassant()
    ) {
      return true;
    }
  }
}

export function getPossiblePawnMoves({futureBoardState, teamColour}) {
  let boardState = futureBoardState;
  var color = teamColour === "WHITE" ? "w" : "b";

// 1. Get Pawn coordinates
var pawnCoordinates = []

// for (let coordinate of allChessCoordinates) {
//   if (boardState[coordinate] === `knight_${color}`) {
//     knightCoordinates.push(new ChessCoordinate(coordinate));
//   }
// }

// 2. Calculate Pawn moves

}

// DEBUG
// export function test(args) {
//   console.log(typeof args)
//   console.log(args)
// }

export function validEnPassant({
  previousFile,
  currentFile,
  previousRank,
  currentRank,
  boardState,
  teamColour,
  moveHistory,
  futureBoardState,
}) {
  // Debugging
  console.log("Parameters");
  console.log(`previousFile: ${previousFile}`);
  console.log(`currentFile: ${currentFile}`);
  console.log(`previousRank: ${previousRank}`);
  console.log(`currentRank: ${currentRank}`);
  console.log("boardState", boardState);
  console.log(`teamColour: ${teamColour}`);
  console.log("moveHistory", moveHistory);

  const enemyColor = teamColour === "WHITE" ? "b" : "w";
  const pawnDirection = teamColour === "WHITE" ? 1 : -1;
  const lastMove = moveHistory[moveHistory.length - 1];
  if (!lastMove) return false;

  const lastMovePiece = boardState[lastMove.piece];

  const lastMoveFrom = new ChessCoordinate(lastMove.from);
  const lastMoveTo = new ChessCoordinate(lastMove.to);
  console.log("lastMovePiece:", lastMovePiece);
  console.log("Enemy Colour:", enemyColor);
  if (
    lastMoveTo.plus({ fileStep: 0, rankStep: 1 * pawnDirection }).coordinate ===
    `${currentFile}${currentRank}`
  ) {
    lastMoveTo.plus({ fileStep: 0, rankStep: -1 * pawnDirection})
    if (
      lastMoveFrom.plus({ rankStep: -2 * pawnDirection, fileStep: 0 }).coordinate ===
      lastMoveTo.coordinate
    ) {
      return true
    }
  }

  // if (
  //   lastMovePiece === `pawn_${enemyColor}` &&
  //   lastMove.from[1] - lastMove.to[1] === 2 * pawnDirection &&
  //   lastMove.to[0] === currentFile &&
  //   previousRank === lastMove.to[1]
  // ) {
  //   return true;
  // }

  return false;
}
