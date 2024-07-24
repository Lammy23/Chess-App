import React from "react";
import ChessTile from "../components/ChessTile";
import { startingPosition } from "./constants";

import "./ChessBoard.css";

function ChessBoard() {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const board = [];
  ranks
    .reverse()
    .forEach((rank) => files.forEach((file) => board.push(file + rank)));

  return (
    <div id="chessboard">
      {
        //Initial Position of the Board
        board.map((position) => {
          let piece = startingPosition[position]; // Using the imported hashmap
          return <ChessTile key={position} position={position} piece={piece} />; // unique key prop added to prevent warning
        })
      }
    </div>
  );
}

export default ChessBoard;
