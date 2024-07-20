import React from "react";
import ChessTile from "./ChessTile";

function ChessBoard() {

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const board = [];
    ranks.reverse().forEach((rank) => files.forEach((file) => board.push(file + rank)))

  return (
    <div id="chessboard">
      {
        board.map((position) => {
        return <ChessTile position={position} color={'red'}/>;
      })}
    </div>
  );
}

export default ChessBoard;
