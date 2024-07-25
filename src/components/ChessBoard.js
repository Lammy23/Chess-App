import React, { useRef } from "react";
import ChessTile from "../components/ChessTile";
import { startingPosition } from "./constants";

import "./ChessBoard.css";
import { useMovementContext } from "../context/MovementContext";

function ChessBoard() {
  const { movePiece, dropPiece } = useMovementContext();
  const chessboardRef = useRef(null);
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const board = [];
  ranks
    .reverse()
    .forEach((rank) => files.forEach((file) => board.push(file + rank)));

  return (
    <div
      id="app"
      onMouseMove={(e) => {
        movePiece(e, chessboardRef);
      }}
      onMouseUp={() => {
        dropPiece();
      }}
    >
      <div id="chessboard" ref={chessboardRef}>
        {
          //Initial Position of the Board
          board.map((position) => {
            let piece = startingPosition[position]; // Using the imported hashmap
            return (
              <ChessTile key={position} position={position} piece={piece} />
            ); // unique key prop added to prevent warning
          })
        }
      </div>
    </div>
  );
}

export default ChessBoard;
