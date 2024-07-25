import React, { createContext, useContext, useState } from "react";

const MovementContext = createContext();

export const useMovementContext = () => useContext(MovementContext);

export const MovementProvider = ({ children }) => {
  const [activePiece, setActivePiece] = useState(null);

  function grabPiece(e) {
    const element = e.target;
    setActivePiece(element); // Takes a while to update, asynchronously. So we use 'element' for now.

    if (element.className === "piece-div") {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      element.style.position = "absolute";
      element.style.top = `${mouseY - 35}px`; // 35px offset to center the piece
      element.style.left = `${mouseX - 35}px`;
    }
  }

  function dropPiece() {
    activePiece && setActivePiece(null);
  }

  function movePiece(e) {
    // const element = e.target;

    if (activePiece && activePiece.className === "piece-div") {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      activePiece.style.position = "absolute";
      activePiece.style.top = `${mouseY - 35}px`; // 35px offset to center the piece
      activePiece.style.left = `${mouseX - 35}px`;
    }
  }

  return (
    <MovementContext.Provider
      value={{ activePiece, grabPiece, movePiece, dropPiece }}
    >
      {children}
    </MovementContext.Provider>
  );
};
