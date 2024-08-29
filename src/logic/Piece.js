import { Color } from "../components/constants";

export class ChessPiece {
  static king = "king";
  static queen = "queen";
  static knight = "knight";
  static bishop = "bishop";
  static rook = "rook";
  static pawn = "pawn";

  pieceColor; // String

  constructor(pieceColor) {
    this.pieceColor = pieceColor;
  }

  static getPiece = (piece) => {
    if (piece) {
      // converting hashmap entry into piece string
      if (piece.slice(0, 4) === "king") return ChessPiece.king;
      if (piece.slice(0, 5) === "queen") return ChessPiece.queen;
      if (piece.slice(0, 6) === "bishop") return ChessPiece.bishop;
      if (piece.slice(0, 4) === "rook") return ChessPiece.rook;
      if (piece.slice(0, 6) === "knight") return ChessPiece.knight;
      if (piece.slice(0, 4) === "pawn") return ChessPiece.pawn;
    } else {
      return false;
    }
  };

  static getColor = (piece) => {
    return piece.slice(-1) === "w" ? Color.white : Color.black;
  };

  getPossibleDiagonalMovesFrom(coordinates, boardState) {
    // Assuming coordinate is of type ChessCoordinate

    const moves = [];
    coordinates.forEach((coordinate) => {
      let origin = coordinate.coordinate;

      let x = [-1, 1, -1, 1];
      let y = [1, 1, -1, -1];

      for (let i = 0; i < x.length; i++) {
        do {
          moves.push(coordinate.coordinate);
          coordinate.plus({ fileStep: x[i], rankStep: y[i] });
        } while (!(coordinate.isOccupied(boardState) || coordinate.isEdge()));
        if (coordinate.isOccupiedByOpponent(boardState, this.pieceColor)) {
          moves.push(coordinate.coordinate);
        }
        coordinate.setCoordinate(origin);
      }
    });

    return moves;
  }

  getPossibleCrossMovesFrom(coordinates, boardState) {
    // Assuming coordinate is of type ChessCoordinate
    const moves = [];
    coordinates.forEach((coordinate) => {
      let origin = coordinate.coordinate;

      let x = [1, -1];

      for (let i = 0; i < x.length; i++) {
        do {
          // horizontal movement
          moves.push(coordinate.coordinate);
          coordinate.plus({ fileStep: x[i], rankStep: 0 });
        } while (
          !(coordinate.isOccupied(boardState) || coordinate.isFileEdge())
        );
        if (coordinate.isOccupiedByOpponent(boardState, this.pieceColor)) {
          moves.push(coordinate.coordinate);
        }

        coordinate.setCoordinate(origin);

        do {
          // vertical movement
          moves.push(coordinate.coordinate);
          coordinate.plus({ fileStep: 0, rankStep: x[i] });
        } while (
          !(coordinate.isOccupied(boardState) || coordinate.isRankEdge())
        );
        if (coordinate.isOccupiedByOpponent(boardState, this.pieceColor)) {
          moves.push(coordinate.coordinate);
        }

        coordinate.setCoordinate(origin);
      }
    });

    return moves;
  }
}
