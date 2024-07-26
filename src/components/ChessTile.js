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
  const { grabPiece } = useMovementContext(); // Using MovementContext Logic
  const color = getColor(position[0], position[1]); // Getting the color of this particular tile

  return (
    <div
      className="chesstile"
      onMouseDown={(e) => { // Checking for a click down and calling the functions
        grabPiece(e, position);
      }}
      style={{ backgroundColor: color }} // Styling with the appropriate background color
    >
      {piece ? ( // Tenary operator that only renders this div if tile has a chess piece, slightly improving performance.
        <div
          className="piece-div"
          style={{ backgroundImage: `url('assets/images/${piece}.png')` }} // Using the piece keyword effectively to render the correct image.
        ></div>
      ) : null}
    </div>
  );
}

export default ChessTile;
