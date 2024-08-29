import { ChessPiece } from "../Piece";

export class Knight extends ChessPiece {
  
  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

 // color handled by ChessPIece
  getPossibleMovesFrom(coordinates, boardState) {
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
            !coordinate.isOccupied(boardState) ||
            coordinate.isOccupiedByOpponent(boardState, this.pieceColor)
          ) {
            moves.push(coordinate.coordinate);
          }
        }

        coordinate.setCoordinate(origin);

        coordinate.plus({ rankStep: x[i], fileStep: y[i] });
        if (coordinate.coordinate !== origin) {
          if (
            !coordinate.isOccupied(boardState) ||
            coordinate.isOccupiedByOpponent(boardState, this.pieceColor)
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
