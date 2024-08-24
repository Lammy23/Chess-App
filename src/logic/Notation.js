import { ChessCoordinate } from "./Coordinates";

export class PieceNotation {
  // Fields

  piece; // String
  from; // ChessCoordinates
  to; // ChessCoordinates
  #piecePosition; // hashmap (private)
  #notation; // String (private)

  /**
   * Constructor
   * @param {string} piece
   * @param {ChessCoordinate} from
   * @param {ChessCoordinate} to
   */
  constructor(piece, from, to, piecePosition) {
    this.piece = piece;
    this.from = from;
    this.to = to;
    this.#piecePosition = piecePosition;
    this.#notation = this.#calculateNotation();
  }

  // Private Methods
  #calculateNotation() {
    if (this.piece.slice(0, 4) === "pawn") {
      // PAWN
      if (this.from.minus(this.to).fileStep === 0) {
        // If on the same file
        return this.to.coordinate;
      } else if (this.#piecePosition[this.to.coordinate]) {
        return `${this.from.file}x${this.to.coordinate}`;
      }
    } else {
      console.log("To be coded...");
    }
  }

  // Public Methods
  getNotation() {
    return this.#notation;
  }
}
