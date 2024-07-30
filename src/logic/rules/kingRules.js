export function kingMove({
  previousRank,
  currentRank,
  previousFile,
  currentFile,
  previousFileNumber,
  currentFileNumber,
  boardState,
  teamColour,
}) {
  let diagonalMove = // Diagonal Movement
    Math.abs(currentFileNumber - previousFileNumber) === 1 &&
    Math.abs(currentRank - previousRank) === 1;
  let verticalMove = // Vertical Movement
    Math.abs(currentRank - previousRank) === 1 && previousFile === currentFile;
  let horizontalMove = // Horizontal Movement
    Math.abs(currentFileNumber - previousFileNumber) === 1 &&
    previousRank === currentRank;

  if (diagonalMove || verticalMove || horizontalMove) {
    if (!this.tileIsOccupied(currentFile, currentRank, boardState)) return true;
    if (
      this.tileIsOccupiedByOpponent(
        currentFile,
        currentRank,
        boardState,
        teamColour
      )
    )
      return true;
  }
  return false;
}
