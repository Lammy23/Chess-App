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

function ChessTile({ position, piece }) {
  const { grabPiece } = useMovementContext(); // Using MovementContext
  const file = position[0];
  const rank = position[1];
  const color = getColor(file, rank);

  return (
    <div
      className="chesstile"
      onMouseDown={(e) => {
        grabPiece(e, position);
      }}
      style={{ backgroundColor: color }}
    >
      {piece ? ( // Tenary operator that only renders div if tile has a chess piece, improving performance.
        <div
          className="piece-div"
          style={{ backgroundImage: `url('assets/images/${piece}.png')` }}
        ></div>
      ) : null}
    </div>
  );
}

export default ChessTile;
