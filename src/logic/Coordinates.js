import { Color, numToFile } from "../components/constants";

export class ChessCoordinate {
  // public fields

  file; // number
  rank; // number
  coordinate; // string

  constructor(coordinate) {
    if (this.#isValidCoordinate(coordinate[0], coordinate[1])) {
      this.file = this.#fileConvert(coordinate[0]);
      this.rank = this.#rankConvert(coordinate[1]);
      this.coordinate = `${numToFile[this.file]}${this.rank}`;
    }
  }

  // private methods

  #fileConvert = (f) =>
    typeof f === "number" ? f : f.toLowerCase().charCodeAt(0) - 96;
  #rankConvert = (r) => parseInt(r);
  #isValidCoordinate(file, rank) {
    return (
      this.#fileConvert(file) >= 1 &&
      this.#fileConvert(file) <= 8 &&
      this.#rankConvert(rank) >= 1 &&
      this.#rankConvert(rank) <= 8
    );
  }

  // public methods

  setCoordinate(coordinate) {
    if (this.#isValidCoordinate(coordinate[0], coordinate[1])) {
      this.file = this.#fileConvert(coordinate[0]);
      this.rank = this.#rankConvert(coordinate[1]);
      this.coordinate = `${numToFile[this.file]}${this.rank}`;
    }
  }

  /**
   * Calculates and returns the target coordinate
   * @param {*} param0
   * @returns
   */
  plus({ fileStep, rankStep }) {
    let newRank = this.rank + this.#rankConvert(rankStep);
    let newFile = this.file + this.#fileConvert(fileStep);

    if (this.#isValidCoordinate(newFile, newRank)) {
      this.rank = newRank;
      this.file = newFile;
      this.coordinate = `${numToFile[newFile]}${newRank}`;
    }

    return this;
  }

  /**
   * Calculates the absolute difference between coordinates
   * @param {ChessCoordinate} chessCoordinate
   * @returns
   */
  minus(chessCoordinate) {
    const fileStep = Math.abs(this.file - chessCoordinate.file);
    const rankStep = Math.abs(this.rank - chessCoordinate.rank);
    return { fileStep: fileStep, rankStep: rankStep };
  }

  isOccupied(boardState) {
    return !!boardState[this.coordinate];
  }

  isOccupiedByOpponent(boardState, teamColor) {
    const piece = boardState[this.coordinate];
    const pieceColor = piece ? piece.slice(-1) : null;
    const enemyColor = Color.getLetter(Color.toggleColor(teamColor));

    if (piece && pieceColor === enemyColor) {
      return true;
    }
    return false;
  }

  isFileEdge() {
    return this.file === 8 || this.file === 1;
  }

  isRankEdge() {
    return this.rank === 8 || this.rank === 1;
  }

  isEdge() {
    return (
      this.rank === 8 || this.rank === 1 || this.file === 8 || this.file === 1
    );
  }

  print() {
    // For debugging
    console.log(`Coordinate: ${this.coordinate}`);
  }
}
