import { allChessCoordinates } from "../../components/constants";
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
    } else if (this.isValidEnPassant()) {
      //DEBUG
      // console.log(boardState[`${currentFile}${currentRank - pawnDirection}`]);
      //Removes the piece that En Passant is suppose to capture by hardcoding setting it to null
      boardState[`${currentFile}${currentRank - pawnDirection}`] = null;
      return true;
    }
  }
}

export function possiblePawnMoves({ futureBoardState, teamColour }) {
  var color = teamColour === "WHITE" ? "w" : "b";
  const specialRank = teamColour === "WHITE" ? 2 : 7;
  const pawnDirection = teamColour === "WHITE" ? 1 : -1;

  // 1. Get Pawn coordinates
  var pawnCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `pawn_${color}`) {
      pawnCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate Pawn moves

  let moveList = [];
  const moveMap = [];

  /**
   *
   * @param {ChessCoordinate} coordinate
   */
  const check = (coordinate) => {
    let origin = coordinate.coordinate;

    if (coordinate.rank === specialRank) {
      if (
        coordinate.plus({ fileStep: 0, rankStep: 2 * pawnDirection }) !== origin
      ) {
        if (!coordinate.isOccupied({ futureBoardState }))
          moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });      }
    }
    if (
      coordinate.plus({ fileStep: 0, rankStep: 1 * pawnDirection }) !== origin
    ) {
      if (!coordinate.isOccupied({ futureBoardState }))
        moveList.push(coordinate.coordinate);
      moveMap.push({
        from: origin,
        to: coordinate.coordinate,
      });    }
  };

  for (let coordinate of pawnCoordinates) {
    check(coordinate);
  }

  return { moveList: moveList, moveMap: moveMap };
}

export function possiblePawnCaptures({ futureBoardState, teamColour }) {
  var color = teamColour === "WHITE" ? "w" : "b";
  const pawnDirection = teamColour === "WHITE" ? 1 : -1;

  // 1. Get Pawn coordinates
  var pawnCoordinates = [];

  for (let coordinate of allChessCoordinates) {
    if (futureBoardState[coordinate] === `pawn_${color}`) {
      pawnCoordinates.push(new ChessCoordinate(coordinate));
    }
  }

  // 2. Calculate Pawn moves

  let moveList = [];
  const moveMap = [];

  /**
   * Function to check if the pawn can capture into the given coordinate
   * @param {ChessCoordinate} coordinate
   */
  const check = (coordinate) => {
    let origin = coordinate.coordinate;

    if (
      coordinate.plus({
        fileStep: 1,
        rankStep: 1 * pawnDirection,
      }).coordinate !== origin
    ) {
      if (
        !coordinate.isOccupied({ futureBoardState }) ||
        coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })
      )
      moveList.push(coordinate.coordinate);
      moveMap.push({
        from: origin,
        to: coordinate.coordinate,
      });    }

    coordinate.setCoordinate(origin);

    if (
      coordinate.plus({
        fileStep: -1,
        rankStep: 1 * pawnDirection,
      }).coordinate !== origin
    ) {
      if (
        !coordinate.isOccupied({ futureBoardState }) ||
        coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })
      )
      moveList.push(coordinate.coordinate);
      moveMap.push({
        from: origin,
        to: coordinate.coordinate,
      });    }
  };

  for (let coordinate of pawnCoordinates) {
    check(coordinate);
  }
  return { moveList: moveList, moveMap: moveMap };
}

export function validEnPassant({
  previousFile,
  currentFile,
  previousRank,
  currentRank,
  boardState,
  teamColour,
  moveHistory,
}) {
  // Debugging
  // console.log("Parameters");
  // console.log(`previousFile: ${previousFile}`);
  // console.log(`currentFile: ${currentFile}`);
  // console.log(`previousRank: ${previousRank}`);
  // console.log(`currentRank: ${currentRank}`);
  // console.log("boardState", boardState);
  // console.log(`teamColour: ${teamColour}`);
  // console.log("moveHistory", moveHistory);

  const pawnDirection = teamColour === "WHITE" ? 1 : -1;
  const lastMove = moveHistory[moveHistory.length - 1];
  if (!lastMove) return false;

  const lastMoveFrom = new ChessCoordinate(lastMove.from);
  const lastMoveTo = new ChessCoordinate(lastMove.to);
  // console.log("Enemy Colour:", enemyColor);
  // console.log("lastMoveFrom", lastMoveFrom);
  // console.log("lastMoveTo", lastMoveTo);

  if (
    lastMoveTo.plus({ fileStep: 0, rankStep: 1 * pawnDirection }).coordinate ===
    `${currentFile}${currentRank}`
  ) {
    lastMoveTo.plus({ fileStep: 0, rankStep: -1 * pawnDirection });
    if (
      lastMoveFrom.plus({ rankStep: -2 * pawnDirection, fileStep: 0 })
        .coordinate === lastMoveTo.coordinate
    ) {
      return true;
    }
  }
  return false;
}

// DEBUG
// export function test(args) {
//   console.log(typeof args)
//   console.log(args)
// }
