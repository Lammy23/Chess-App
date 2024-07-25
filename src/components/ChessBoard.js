import React, { useRef } from "react";
import ChessTile from "../components/ChessTile";

import "./ChessBoard.css";
import { useMovementContext } from "../context/MovementContext";

function ChessBoard() {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const board = [];

  ranks
    .reverse()
    .forEach((rank) => files.forEach((file) => board.push(file + rank)));

  const { movePiece, dropPiece, piecePosition } = useMovementContext();
  const chessboardRef = useRef(null);

  if (piecePosition)
    return (
      <div
        id="app"
        onMouseMove={(e) => {
          movePiece(e, chessboardRef);
        }}
        onMouseUp={() => {
          dropPiece(chessboardRef);
        }}
      >
        <div id="chessboard" ref={chessboardRef}>
          {board.map((position) => {
            let piece = piecePosition[position]; // Using the hashmap
            return (
              <ChessTile key={position} position={position} piece={piece} />
            ); // unique key prop added to prevent warning
          })}
        </div>
      </div>
    );
}

export default ChessBoard;
