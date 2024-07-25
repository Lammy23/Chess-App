import React, { createContext, useContext, useEffect, useState } from "react";
import { files, ranks } from "../components/constants";
// TODO: Make chessboardref passed to whole movementcontext.
const MovementContext = createContext();

export const useMovementContext = () => useContext(MovementContext);

export const MovementProvider = ({ children }) => {
  const [piecePosition, setPiecePosition] = useState(null);
  const [activePiece, setActivePiece] = useState(null);
  const [activePieceOrigin, setActivePieceOrigin] = useState("a1");
  const [refresh, setRefresh] = useState(false);

  function grabPiece(e, position) {
    setActivePieceOrigin(position);
    console.log(position);
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

  function dropPiece(chessboardRef) {
    const chessboard = chessboardRef.current;
    const leftBound = chessboard.offsetLeft;
    const topBound = chessboard.offsetTop;

    let positionX = activePiece.style.left;
    let positionY = activePiece.style.top;

    const currentCoordinates = coordinatesToFileAndRank(
      positionX,
      positionY,
      leftBound,
      topBound
    );

    if (currentCoordinates && currentCoordinates !== activePieceOrigin)
      setPiecePosition((prev) => {
        const oldCoordinates = prev[activePieceOrigin];
        const updatedPosition = { ...prev };
        updatedPosition[currentCoordinates] = oldCoordinates;
        updatedPosition[activePieceOrigin] = null;
        return updatedPosition;
      });
      else {
        // If the piece is dropped in the same position or out of bounds, reset the piece
        activePiece.style.position = "relative";
        activePiece.style.top = "0px";
        activePiece.style.left = "0px";
      }

    // Force re-render
    setRefresh((prev) => !prev);

    activePiece && setActivePiece(null);
  }

  function coordinatesToFileAndRank(positionX, positionY, leftBound, topBound) {
    // Extract the coordinates

    var x = parseInt(positionX.slice(0, positionX.length - 2));
    var y = parseInt(positionY.slice(0, positionY.length - 2));

    // Account for the board offset

    x = x - leftBound + 35; // 35px to account for center of piece
    y = y - topBound + 35;

    // Account for size of tile

    x = Math.floor(x / 70);
    y = Math.floor(y / 70);

    // Flip y presentation (to fix error)

    y = 7 - y;

    // Get ranking and filing

    x = files[x];
    y = ranks[y];

    if (x && y) return `${x}${y}`;
    else return null;
  }

  function movePiece(e, chessboardRef) {
    const chessboard = chessboardRef.current;
    const leftBound = chessboard.offsetLeft;
    const topBound = chessboard.offsetTop;
    const rightBound = leftBound + chessboard.clientWidth;
    const bottomBound = topBound + chessboard.clientHeight;

    // In true baller fashion, we want to print the position (file + rank) that the piece is hovering on

    if (activePiece) {
      let positionX = activePiece.style.left;
      let positionY = activePiece.style.top;
      console.log(
        coordinatesToFileAndRank(positionX, positionY, leftBound, topBound)
      );
    }

    if (activePiece && activePiece.className === "piece-div") {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      activePiece.style.position = "absolute";

      if (mouseX >= leftBound && mouseX <= rightBound)
        activePiece.style.left = `${mouseX - 35}px`;

      if (mouseY >= topBound && mouseY <= bottomBound)
        activePiece.style.top = `${mouseY - 35}px`;
    }
  }

  useEffect(() => {
    setPiecePosition({
      // Hashmap representing starting positions
      a1: "rook_w",
      b1: "knight_w",
      c1: "bishop_w",
      d1: "queen_w",
      e1: "king_w",
      f1: "bishop_w",
      g1: "knight_w",
      h1: "rook_w",
      a2: "pawn_w",
      b2: "pawn_w",
      c2: "pawn_w",
      d2: "pawn_w",
      e2: "pawn_w",
      f2: "pawn_w",
      g2: "pawn_w",
      h2: "pawn_w",
      a7: "pawn_b",
      b7: "pawn_b",
      c7: "pawn_b",
      d7: "pawn_b",
      e7: "pawn_b",
      f7: "pawn_b",
      g7: "pawn_b",
      h7: "pawn_b",
      a8: "rook_b",
      b8: "knight_b",
      c8: "bishop_b",
      d8: "queen_b",
      e8: "king_b",
      f8: "bishop_b",
      g8: "knight_b",
      h8: "rook_b",
    });
  }, []);

  return (
    <MovementContext.Provider
      value={{
        activePiece,
        activePieceOrigin,
        setActivePiece,
        setActivePieceOrigin,
        grabPiece,
        movePiece,
        dropPiece,
        piecePosition,
        refresh,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
