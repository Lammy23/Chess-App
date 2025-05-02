import React from "react";
import { useMovementContext } from "../context/MovementContext";

import "./ChessTile.css";

/**
 * This function returns a color based on the position of the tile on the board
 * @param {String} file
 * @param {String} rank
 * @returns color
 */
function getColor(file, rank) {
  if ((file.charCodeAt(0) + parseInt(rank)) % 2 === 0) {
    return "#4e7598";
  }
  return "#ebecd0";
}

function ChessTile({ position, piece, isBoardLocked }) { // Added isBoardLocked prop
  const { grabPiece } = useMovementContext(); // Using MovementContext Logic
  const color = getColor(position[0], position[1]); // Getting the color of this particular tile

  return (
    <div
      className="chesstile"
      onMouseDown={(e) => {
        if (isBoardLocked) return; // Prevent interaction when the board is locked
        grabPiece(e, position); // Call grabPiece only if the board is not locked
      }}
      style={{ backgroundColor: color }} // Styling with the appropriate background color
    >
      {piece ? ( // Ternary operator that only renders this div if the tile has a chess piece, slightly improving performance.
        <div
          className="piece-div"
          style={{ backgroundImage: `url('assets/images/${piece}.png')` }} // Using the piece keyword effectively to render the correct image.
        ></div>
      ) : null}
    </div>
  );
}

export default ChessTile;
