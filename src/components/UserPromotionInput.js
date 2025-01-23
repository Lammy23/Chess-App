import React from "react";
import "./UserPromotionInput.css";

export default function UserPromotionInput({ onPromotionChoice }) {
  // Array of promotion options
  const promotionOptions = ["queen", "rook", "bishop", "knight"]; // These are the pieces the user can choose for promotion

  return (
    <div className="promotion-modal">
      <h3>Choose a piece for promotion:</h3> {/* Title for the modal */}
      <div className="promotion-options">
        {promotionOptions.map((piece) => (
          <button
            key={piece} // Unique key for React list rendering
            className="promotion-button"
            onClick={() => onPromotionChoice(piece)} // Pass the chosen piece back to the parent component
          >
            {piece}
          </button>
        ))}
      </div>
    </div>
  );
}
