export function pawnMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
  moveHistory
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
    } else if (this.validEnPassant(previousFile, currentFile, previousRank, currentRank, boardState, teamColour, moveHistory)) {
      return true;
    }
  }
}

export function getPossiblePawnMoves() {}

// DEBUG
// export function test(args) {
//   console.log(typeof args)
//   console.log(args)
// }

export function validEnPassant(previousFile, currentFile, previousRank, currentRank, boardState, teamColour, moveHistory) {
  const pawnDirection = (teamColour === "WHITE") ? 1 : -1;
  const lastMove = moveHistory[moveHistory.length - 1];
  if (!lastMove) return false;

  const lastMovePiece = boardState[lastMove.to];
  if (
    lastMovePiece === `pawn_${(teamColour === "WHITE") ? "b" : "w"}` &&
    lastMove.from[1] - lastMove.to[1] === 2 * pawnDirection &&
    lastMove.to[0] === currentFile &&
    previousRank === lastMove.to[1]
  ) {
    return true;
  }

  return false;
}