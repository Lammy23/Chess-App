import { ChessPiece } from "../Piece";

export class King extends ChessPiece {
  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

  // color is handled in ChessPiece

  getPossibleMovesFrom(coordinates, boardState) {
    const moves = [];
    coordinates.forEach((coordinate) => {
      let origin = coordinate.coordinate;

      const x = [-1, 0, 1]; // File
      const y = [1, 0, -1]; // Rank

      for (let file of x) {
        for (let rank of y) {
          if (
            coordinate.plus({ fileStep: file, rankStep: rank }).coordinate !==
            origin
          ) {
            if (
              !coordinate.isOccupied(boardState) ||
              coordinate.isOccupiedByOpponent(boardState, this.pieceColor)
            ) {
              moves.push(coordinate.coordinate);
            }
          }
          coordinate.setCoordinate(origin);
        }
      }
    });
    return moves;
  }
}
