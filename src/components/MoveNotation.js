import React, { useEffect, useState } from "react";
import { useMovementContext } from "../context/MovementContext";
import "./MoveNotation.css";
import { Color } from "./constants";

function MoveNotation({ moveNotation, color, moveSetNumber }) {
  const [active, setActive] = useState(false);
  const { moveCount } = useMovementContext();
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
  return <div id={"inactive"}>{moveNotation}</div>;
}

export default MoveNotation;
