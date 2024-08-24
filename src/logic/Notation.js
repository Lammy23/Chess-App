import { ChessCoordinate } from "./Coordinates";
import { ChessPiece } from "./Piece";
import { Knight } from "./pieces/Knight";
import { Color } from "../components/constants";

export class PieceNotation {
  // Fields

  piece; // String
  from; // ChessCoordinates
  to; // ChessCoordinates
  #boardState;

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
  constructor(piece, from, to, isCapture, isCheck, isCheckmate, boardState) {
    this.piece = piece;
    this.from = from;
    this.to = to;
    this.#isCapture = isCapture;
    this.#isCheck = isCheck;
    this.#isCheckmate = isCheckmate;
    this.#boardState = boardState;

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
    }
  }

  #knightNotation() {
    // KNIGHT
    this.#piecePart = "N";
    // lol if it was a capture (or check) which knight did it? (for file part)
    const knight = new Knight(Color.white, this.#boardState);
    knight.getPossibleMovesFrom(this.to)
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
