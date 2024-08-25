import React, { useEffect, useState } from "react";
import { useMovementContext } from "../context/MovementContext";
import "./MoveNotation.css";
import { Color } from "./constants";

function MoveNotation({ moveNotation, color, moveSetNumber }) {
  const [active, setActive] = useState(false);
  const {
    moveCount,
    setMoveCount,
    setInEditMode,
    setCurrentTurn,
    currentTurn,
  } = useMovementContext();
  useEffect(() => {
    if (color === Color.white) {
      if (moveSetNumber * 2 - 1 === moveCount) {
        setActive(true);
      } else {
        setActive(false);
      }
    } else if (color === Color.black) {
      if (moveSetNumber * 2 === moveCount) {
        setActive(true);
      } else {
        setActive(false);
      }
    }
  }, [color, moveCount, moveSetNumber]);
  if (active) {
    return <div id={"active"}>{moveNotation}</div>;
  }
  return (
    <div
      onClick={() => {
        setInEditMode(false);
        console.log("Hello");
        setMoveCount((prev) => {
          return color === Color.white
            ? moveSetNumber * 2 - 1
            : moveSetNumber * 2;
        });

        // reflect turns
        setCurrentTurn((prev) => {
          return color === Color.white ? Color.black : Color.white;
        });
      }}
      id={"inactive"}
    >
      {moveNotation}
    </div>
  );
}

export default MoveNotation;
