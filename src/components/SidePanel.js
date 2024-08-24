import React, { useEffect, useState } from "react";
import "./SidePanel.css";
import MoveStrip from "./MoveStrip";
import { useMovementContext } from "../context/MovementContext";
import { PieceNotation } from "../logic/Notation";
import { ChessCoordinate } from "../logic/Coordinates";

function SidePanel() {
  const [moveList, setMoveList] = useState([]);
  const { moveHistory, moveCount, boardState } = useMovementContext();

  useEffect(() => {
    const latest = moveHistory[moveCount - 1];
    const currentMoveSet = Math.ceil(moveCount / 2);
    if (latest) {
      if (
        moveList[0] &&
        currentMoveSet <= moveList[moveList.length - 1].moveSetNumber
      ) {
        console.log(currentMoveSet);
        setMoveList((prev) => {
          const working = prev[currentMoveSet - 1];
          working.blackMove = new PieceNotation(
            latest.piece,
            new ChessCoordinate(latest.from),
            new ChessCoordinate(latest.to),
            boardState
          ).getNotation();
          return [...prev];
        });
      } else {
        console.log(currentMoveSet);
        setMoveList((prev) => {
          prev[currentMoveSet - 1] = {
            moveSetNumber: currentMoveSet,
            whiteMove: new PieceNotation(
              latest.piece,
              new ChessCoordinate(latest.from),
              new ChessCoordinate(latest.to),
              boardState
            ).getNotation(),
          };
          return [...prev];
        });
      }
    }
  }, [moveHistory, moveCount]);

  return (
    <div id="side-panel" className="background">
      {moveList.map(({ moveSetNumber, whiteMove, blackMove }) => {
        return (
          <MoveStrip
            moveSetNumber={moveSetNumber}
            whiteMove={whiteMove}
            blackMove={blackMove}
          />
        );
      })}
    </div>
  );
}

export default SidePanel;
