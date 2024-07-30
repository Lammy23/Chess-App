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
  // #SUGGESTION: Can condense this code
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
}
