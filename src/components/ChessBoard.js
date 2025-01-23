import React, { useState, useEffect } from "react";
import ChessTile from "../components/ChessTile";
import "./ChessBoard.css";
import { useMovementContext } from "../context/MovementContext";
import SidePanel from "./SidePanel";
import UserPromotionInput from "../components/UserPromotionInput";

function ChessBoard() {
	const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
	const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
	const board = [];

	// Pushing all possible positions to the board constant. These are used to map chess tiles on the board.
	// TODO: since the board doesn't change, move it to constants.js
	ranks
		.reverse()
		.forEach((rank) => files.forEach((file) => board.push(file + rank)));

	// Variables and functions from the MovementContext (Logic)
	const { movePiece, dropPiece, boardState, redo, undo, promotePawn } =
		useMovementContext();

	// State for pawn promotion
	const [promotionPosition, setPromotionPosition] = useState(null); // Tracks position of the pawn being promoted
	const [promotionTeam, setPromotionTeam] = useState(null); // Tracks the team color of the pawn being promoted

	// New state for locking the board during promotion
	const [isBoardLocked, setIsBoardLocked] = useState(false);

	// Need to fix this since moveHistory is not used here. Is there a way to use it here or take it out
	// without it affecting movement context?

	// Promotion logic to detect when a pawn reaches the promotion rank
  useEffect(() => {
    if (boardState) {
      let promotionStillValid = false; // Tracks if a promotion is still valid
      for (let position of Object.keys(boardState)) {
        const piece = boardState[position];
        if (piece?.startsWith("pawn")) {
          const rank = position[1]; // Extract rank (e.g., "e8" -> "8")
          const isWhitePromotion = piece.endsWith("_w") && rank === "8";
          const isBlackPromotion = piece.endsWith("_b") && rank === "1";
  
          // If promotion conditions are met
          if (isWhitePromotion || isBlackPromotion) {
            promotionStillValid = true;
            setPromotionPosition(position); // Set the position for promotion
            setPromotionTeam(piece.endsWith("_w") ? "white" : "black"); // Set the team
            setIsBoardLocked(true); // Lock the board
            break;
          }
        }
      }
  
      // If no promotion is valid anymore, clear the modal and unlock the board
      if (!promotionStillValid) {
        setPromotionPosition(null);
        setPromotionTeam(null);
        setIsBoardLocked(false); // Unlock the board when promotion is no longer valid
      }
    }
  }, [boardState]); // Only depend on boardState

	// Function to handle user selection of promotion piece
	const handlePromotionChoice = (choice) => {
		if (promotionPosition) {
			promotePawn(promotionPosition, choice, promotionTeam); // Promote pawn based on user choice
			setPromotionPosition(null); // Clear promotion state
			setIsBoardLocked(false); // Unlock the board after promotion
		}
	};

	// UseEffect for undo and redo functionality
  useEffect(() => {
    const handleRewind = (e) => {
      if (e.key === "ArrowLeft") {
        undo(e); // Always allow undo
      } else if (e.key === "ArrowRight") {
        redo(e); // Always allow redo
      }
    };
  
    window.addEventListener("keydown", handleRewind);
    return () => {
      window.removeEventListener("keydown", handleRewind);
    };
  }, [undo, redo]); // Depend only on undo and redo

	if (boardState)
		// Checking if the starting position of the pieces (hashmap) has been assigned yet by MovementContext
		return (
			<div
				id="app"
				onMouseMove={(e) => {
					// Checking for movement of mouse and calling the functions
					if (!isBoardLocked) movePiece(e); // Only allow movement when board is not locked
				}}
				onMouseUp={() => {
					// Checking for the "mouse up" or letting go of the click and calling the function
					if (!isBoardLocked) dropPiece(); // Only allow dropping when board is not locked
				}}
				/* The grabPiece function isn't called here but rather in the ChessTile component itself. */
			>
				<div
					id="chessboard"
					className={isBoardLocked ? "locked" : ""} // Added class to visually indicate locked state
				>
					{board.map((position) => {
						let piece = boardState[position]; // Using the starting position hashmap. Piece is a string like 'pawn_b' 'king_w'
						return (
							<ChessTile
								key={position}
								position={position}
								piece={piece}
								isBoardLocked={isBoardLocked} // Pass the lock state to each tile
							/>
						); // Added a unique key prop to prevent a warning
					})}
				</div>
				<SidePanel />
				{/* Render promotion modal if needed */}
				{promotionPosition && (
					<UserPromotionInput onPromotionChoice={handlePromotionChoice} />
				)}
			</div>
		);

	return null; // Return null if the board state hasn't been initialized yet
}

export default ChessBoard;
