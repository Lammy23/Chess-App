import React, { useEffect } from "react";
import ChessTile from "../components/ChessTile";
import "./ChessBoard.css";
import { useMovementContext } from "../context/MovementContext";

function ChessBoard() {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const board = [];

  // Pushing all possible positions to the board constant. These are used to map chess tiles on the board.
  // TODO: since the board doesn't change, move it to constants.js
  ranks
    .reverse()
    .forEach((rank) => files.forEach((file) => board.push(file + rank)));

  // Need to fix this since moveHistory is not used here. Is there a way to use it here or take it out
  // without it affecting movement context?
  const { movePiece, dropPiece, boardState, redo, undo } = useMovementContext(); // Using variables and functions from the MovementContext (Logic)

  useEffect(() => {
    const handleRewind = (e) => {
      if (e.key === "ArrowLeft") {
        undo(e);
      } else if (e.key === "ArrowRight") {
        redo(e);
        // to be coded
      }
    };
    window.addEventListener("keydown", handleRewind);
    return () => {
      window.removeEventListener("keydown", handleRewind);
    };
  }, [undo, redo]);
  if (boardState)
    // Checking if the starting position of the pieces (hashmap) has been assigned yet by MovementContext
    return (
      <div
        id="app"
        onMouseMove={(e) => {
          // Checking for movement of mouse and calling the functions
          movePiece(e);
        }}
        onMouseUp={() => {
          // Checking for the "mouse up" or letting of the the click and calling the function
          dropPiece();
        }}
        /* The grabPiece function isn't called here but rather in the ChessTile component itself. */
      >
        <div id="chessboard">
          {board.map((position) => {
            let piece = boardState[position]; // Using the starting position hashmap. Piece is a string like 'pawn_b' 'king_w'
            return (
              <ChessTile key={position} position={position} piece={piece} />
            ); // Added a unique key prop to prevent a warning
          })}
        </div>
      </div>
    );
}

export default ChessBoard;
