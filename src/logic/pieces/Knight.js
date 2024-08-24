import { ChessPiece } from "../Piece";

export class Knight extends ChessPiece {
  
  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

  // Fields
  pieceColor; // String
  #boardState;

  constructor(pieceColor, boardState) {
    super();
    this.pieceColor = pieceColor;
    this.#boardState = boardState;
  }

  getPossibleMovesFrom(...coordinates) {
    const moves = [];
    coordinates.forEach((coordinate) => {
      // possible knight moves
      let x = [2, 2, -2, -2];
      let y = [-1, 1, -1, 1];

      let origin = coordinate.coordinate;

      for (let i = 0; i < x.length; i++) {
        coordinate.plus({ fileStep: x[i], rankStep: y[i] });
        if (coordinate.coordinate !== origin) {
          if (
            !coordinate.isOccupied(this.#boardState) ||
            coordinate.isOccupiedByOpponent(this.#boardState, this.pieceColor)
          ) {
            moves.push(coordinate.coordinate);
          }
        }

        coordinate.setCoordinate(origin);

        coordinate.plus({ rankStep: x[i], fileStep: y[i] });
        if (coordinate.coordinate !== origin) {
          if (
            !coordinate.isOccupied(this.#boardState) ||
            coordinate.isOccupiedByOpponent(this.#boardState, this.pieceColor)
          ) {
            moves.push(coordinate.coordinate);
          }
        }
        coordinate.setCoordinate(origin);
      }
    });
    return moves;
  }
}
