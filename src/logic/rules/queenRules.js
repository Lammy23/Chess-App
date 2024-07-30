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
  // Logic is the same as a bishop and rook combined
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
  } else if (
    Math.abs(currentFileNumber - previousFileNumber) ===
    Math.abs(currentRank - previousRank)
  ) {
    // Forces it to compare using either the currentCoordinates or previousCoordinates depending
    // on whether it is moving up or down diagonally
    const minFile = Math.min(currentFileNumber, previousFileNumber);
    const minRank = Math.min(currentRank, previousRank);
    for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
      if (
        this.tileIsOccupied(
          this.numberToFile(minFile + i),
          minRank + i,
          boardState
        )
      ) {
        // console.log(boardState);
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
