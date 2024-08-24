import { Color } from "../../components/constants";
import { ChessPiece } from "../Piece";

export class Pawn extends ChessPiece { // TODO: make the extension meaningful
  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

  pieceColor; // String
  #specialRank; // number
  #pawnDirection; // number
  #boardState; // hashmap

  constructor(pieceColor, boardState) {
    super();
    this.pieceColor = pieceColor;
    this.#boardState = boardState;
    this.#specialRank = pieceColor === Color.white ? 2 : 7;
    this.#pawnDirection = pieceColor === Color.white ? 1 : -1;
  }

  getPossibleMovesFrom(...coordinates) {
    const moves = [];
    coordinates.forEach((coordinate) => {
      let origin = coordinate.coordinate;
      if (coordinate.rank === this.#specialRank) {
        if (
          coordinate.plus({
            fileStep: 0,
            rankStep: 2 * this.#pawnDirection,
          }) !== origin // If operation doesn't bounce
        ) {
          if (!coordinate.isOccupied(this.#boardState))
            moves.push(coordinate.coordinate);
        }
      }
      if (
        coordinate.plus({ fileStep: 0, rankStep: 1 * this.#pawnDirection }) !==
        origin
      ) {
        if (!coordinate.isOccupied(this.#boardState))
          moves.push(coordinate.coordinate);
      }
    });

    return moves;
  }

  getPossibleCapturesFrom(...coordinates) {
    const captures = [];
    coordinates.forEach((coordinate) => {
      let origin = coordinate.coordinate;
      if (
        coordinate.plus({
          fileStep: 1,
          rankStep: 1 * this.#pawnDirection,
        }).coordinate !== origin
      ) {
        if (
          !coordinate.isOccupied(this.#boardState) ||
          coordinate.isOccupiedByOpponent(this.#boardState, this.pieceColor)
        )
          captures.push(coordinate.coordinate);
      }

      coordinate.setCoordinate(origin);

      if (
        coordinate.plus({
          fileStep: -1,
          rankStep: 1 * this.#pawnDirection,
        }).coordinate !== origin
      ) {
        if (
          !coordinate.isOccupied(this.#boardState) ||
          coordinate.isOccupiedByOpponent(this.#boardState, this.pieceColor)
        )
          captures.push(coordinate.coordinate);
      }
    });

    return captures;
  }
}
