import { numToFile } from "../components/constants";

export class ChessCoordinates {
  // fields
  file; // number
  rank; // number
  coordinate;

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

  plus({ fileStep, rankStep }) {
    let newRank = this.rank + this.#rankConvert(rankStep);
    let newFile = this.file + this.#fileConvert(fileStep);

    if (this.#isValidCoordinate(newFile, newRank)) {
      this.rank = newRank;
      this.file = newFile;
    }
  }

  plusVal({ fileStep, rankStep }) {
    let newRank = this.rank + this.#rankConvert(rankStep);
    let newFile = this.file + this.#fileConvert(fileStep);

    if (this.#isValidCoordinate(newFile, newRank))
      return `${numToFile[newFile]}${newRank}`;
    return null;
  }

  print() {
    console.log(`Coordinate: ${numToFile[this.file]}${this.rank}`);
  }
}
