import React, { act, createContext, useContext, useState } from "react";

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

  function movePiece(e, chessboardRef) {
    const chessboard = chessboardRef.current;
    if (activePiece && activePiece.className === "piece-div") {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      activePiece.style.position = "absolute";

      const leftBound = chessboard.offsetLeft;
      const topBound = chessboard.offsetTop;
      const rightBound = leftBound + chessboard.clientWidth;
      const bottomBound = topBound + chessboard.clientHeight;

      if (mouseX >= leftBound && mouseX <= rightBound)
        activePiece.style.left = `${mouseX - 35}px`;

      if (mouseY >= topBound && mouseY <= bottomBound)
        activePiece.style.top = `${mouseY - 35}px`;
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
