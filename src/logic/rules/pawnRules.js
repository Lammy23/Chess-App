export function isPawnMove(
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour
) {
  // Below 2 lines are for if its a white or black pawn
  const specialRank = teamColour === "WHITE" ? 2 : 7;
  const pawnDirection = teamColour === "WHITE" ? 1 : -1;
  //Pawn Logic
  //#SUGGESTION: tileIsOccupied and tileIsOccupiedByOpponent is possibly redundant?
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
    }
    // #TODO: Discuss how we will want to implement this
    // else if (this.validEnPassant(currentFile, currentRank - pawnDirection, boardState, teamColour)) {
    //     return true;
    // }
  }
}
