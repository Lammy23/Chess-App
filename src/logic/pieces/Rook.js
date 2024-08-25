import { ChessPiece } from "../Piece";

export class Rook extends ChessPiece {
  // getPossibleMoves(<ChessCoordinate>[] coordinates): <String>[] (list of coordinates)
  // getPossibleMoveMap() - separation of concerns

  // color is handled in ChessPiece

  getPossibleMovesFrom(coordinates, boardState) {
    const moves = [];
    coordinates.forEach((coordinate) => {
      moves.push(...this.getPossibleCrossMovesFrom([coordinate], boardState));
    });

    return moves;
  }
}
