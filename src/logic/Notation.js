import { ChessCoordinate } from "./Coordinates";

export class PieceNotation {
  // Fields

  piece; // String
  from; // ChessCoordinates
  to; // ChessCoordinates
  #piecePosition; // hashmap (private)

  // Notation parts (private)
  #piecePart = "";
  #filePart = "";
  #takesPart = "";
  #checkPart = "";
  #checkmatePart = "";
  #fullNotation = "";

  // Castles
  #isCastleQueenSide;
  #isCastleKingSide;



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
    this.#fullNotation = this.#calculateNotation();
  }

  // Private Methods
  #calculateNotation() {
    if (this.piece.slice(0, 4) === "pawn") {
      // PAWN
      if (this.from.minus(this.to).fileStep === 0) {
        // If on the same file
        return this.to.coordinate;
      } else if (this.#piecePosition[this.to.coordinate]) {
        return `${this.from.coordinate[0]}x${this.to.coordinate}`;
      }
    } else {
      console.log("To be coded...");
    }
  }

  // Public Methods
  getFullNotation() {
    return this.#fullNotation;
  }
}
