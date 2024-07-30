export function bishopMove({
  previousRank,
  currentRank,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  let prerequisite = // The difference in files MUST BE SAME as difference in ranks for a valid bishop move
    Math.abs(currentFileNumber - previousFileNumber) ===
    Math.abs(currentRank - previousRank);

  if (prerequisite) {
    // Forces it to compare using either the currentCoordinates or previousCoordinates depending
    // on whether it is moving up or down diagonally
    const minFile = Math.min(currentFileNumber, previousFileNumber);
    const minRank = Math.min(currentRank, previousRank);

    // console.log(minFile, minRank);

    for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
      if (
        this.tileIsOccupied(
          this.numberToFile(minFile + i),
          minRank + i,
          boardState
        )
      ) {
        console.log(minFile + i, minRank + i)
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
