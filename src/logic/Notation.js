import { ChessCoordinate } from "./Coordinates";
import { ChessPiece } from "./Piece";

export class PieceNotation {
  // Fields

  piece; // String
  from; // ChessCoordinates
  to; // ChessCoordinates

  // Notation parts (private)
  #piecePart = "";
  #filePart = "";
  #takesPart = "";
  #coordinatePart = "";
  #checkPart = "";
  #checkmatePart = "";

  fullNotation = "";

  // Castles
  #isCastleQueenSide;
  #isCastleKingSide;

  // Booleans
  #isCapture;
  #isCheck;
  #isCheckmate;

  // Piece map
  pieceMap = {
    // TODO: add more
    pawn: this.#pawnNotation,
  };

  /**
   * Constructor
   * @param {string} piece
   * @param {ChessCoordinate} from
   * @param {ChessCoordinate} to
   */
  constructor(piece, from, to, isCapture, isCheck, isCheckmate) {
    this.piece = piece;
    this.from = from;
    this.to = to;
    this.#isCapture = isCapture;
    this.#isCheck = isCheck;
    this.#isCheckmate = isCheckmate;

    this.#takesPart = this.#isCapture ? "x" : "";
    if (this.#isCheck) {
      this.#checkPart = "+";
    } else if (this.#isCheckmate) {
      this.#checkmatePart = "#";
    }
    this.#calculateNotation();
  }

  // Private Methods
  #pawnNotation() {
    // PAWN
    if (!this.#isCapture) {
      // If on the same file
      this.#coordinatePart = this.to.coordinate;
    } else {
      // If on different files
      this.#filePart = this.from.coordinate[0];
      this.#coordinatePart = this.to.coordinate;
      // return `${this.from.coordinate[0]}x${this.to.coordinate}`;
    }
  }

  #calculateNotation() {
    if (this.piece === ChessPiece.pawn) this.#pawnNotation();

    this.fullNotation =
      this.#piecePart +
      this.#filePart +
      this.#takesPart +
      this.#coordinatePart +
      this.#checkPart +
      this.#checkmatePart;
  }
}
