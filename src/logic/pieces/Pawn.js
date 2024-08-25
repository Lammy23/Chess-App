import { Color } from "../../components/constants";
import { ChessPiece } from "../Piece";

export class Pawn extends ChessPiece {
  // TODO: make the extension meaningful

  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

  #specialRank; // number
  #pawnDirection; // number

  constructor(pieceColor) {
    super(pieceColor);
    this.#specialRank = pieceColor === Color.white ? 2 : 7;
    this.#pawnDirection = pieceColor === Color.white ? 1 : -1;
  }

  getPossibleMovesFrom(coordinates, boardState) {
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
          if (!coordinate.isOccupied(boardState))
            moves.push(coordinate.coordinate);
        }
      }
      if (
        coordinate.plus({ fileStep: 0, rankStep: 1 * this.#pawnDirection }) !==
        origin
      ) {
        if (!coordinate.isOccupied(boardState))
          moves.push(coordinate.coordinate);
      }
    });

    return moves;
  }

  getPossibleCapturesFrom(coordinates, boardState) {
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
          !coordinate.isOccupied(boardState) ||
          coordinate.isOccupiedByOpponent(boardState, this.pieceColor)
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
          !coordinate.isOccupied(boardState) ||
          coordinate.isOccupiedByOpponent(boardState, this.pieceColor)
        )
          captures.push(coordinate.coordinate);
      }
    });

    return captures;
  }
}
