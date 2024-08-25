import React, { useEffect, useState } from "react";
import "./SidePanel.css";
import MoveStrip from "./MoveStrip";
import { useMovementContext } from "../context/MovementContext";
import { PieceNotation } from "../logic/Notation";
import { ChessCoordinate } from "../logic/Coordinates";

function SidePanel() {
  const [moveList, setMoveList] = useState([]);
  const {
    moveHistory,
    moveCount,
    boardHistory,
    lastMoveWasCapture,
    lastMoveWasCheck,
    lastMoveWasCheckmate,
    currentTurn,
  } = useMovementContext();

  useEffect(() => {
    const latest = moveHistory[moveCount - 1];
    const currentMoveSet = Math.ceil(moveCount / 2);
    if (latest) {
      if (
        moveList[0] &&
        currentMoveSet <= moveList[moveList.length - 1].moveSetNumber
      ) {
        setMoveList((prev) => {
          const working = prev[currentMoveSet - 1];
          working.blackMove = new PieceNotation(
            latest.piece,
            new ChessCoordinate(latest.from),
            new ChessCoordinate(latest.to),
            lastMoveWasCapture,
            lastMoveWasCheck,
            lastMoveWasCheckmate
          ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
          return [...prev];
        });
      } else {
        setMoveList((prev) => {
          prev[currentMoveSet - 1] = {
            moveSetNumber: currentMoveSet,
            whiteMove: new PieceNotation(
              latest.piece,
              new ChessCoordinate(latest.from),
              new ChessCoordinate(latest.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn),
          };
          return [...prev];
        });
      }
    }
  }, [moveHistory, moveCount, boardHistory]);

  return (
    <div id="side-panel" className="background">
      {moveList.map(({ moveSetNumber, whiteMove, blackMove }) => {
        return (
          <MoveStrip
            key={moveSetNumber}
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
