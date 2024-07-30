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
  if(Math.abs(currentFileNumber - previousFileNumber) === 1 && Math.abs(currentRank - previousRank) === 1) {
    // Diagonal Movement
} else if (Math.abs(currentRank - previousRank) === 1 && previousFile === currentFile) { 
    // Vertical Movement
} else if (Math.abs(currentFileNumber - previousFileNumber) === 1 && previousRank === currentRank) {
    // Horizontal Movement
} else {
    return false;
}
// If it is occupied, then it must be either the same or opposing colour
if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
    return true;
} else if (this.tileIsOccupiedByOpponent(currentFile, currentRank, boardState, teamColour)) {
    return true;
} 
}
