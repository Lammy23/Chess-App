export class ChessPiece {
  static king = "king";
  static queen = "queen";
  static knight = "knight";
  static bishop = "bishop";
  static rook = "rook";
  static pawn = "pawn";

// no constructor

  static getPiece = (piece) => { // converting hashmap entry into piece string
    if (piece.slice(0, 4) === "king") return ChessPiece.king;
    if (piece.slice(0, 5) === "queen") return ChessPiece.queen;
    if (piece.slice(0, 6) === "bishop") return ChessPiece.bishop;
    if (piece.slice(0, 4) === "rook") return ChessPiece.rook;
    if (piece.slice(0, 6) === "knight") return ChessPiece.knight;
    if (piece.slice(0, 4) === "pawn") return ChessPiece.pawn;
  };
}
