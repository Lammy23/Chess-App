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
