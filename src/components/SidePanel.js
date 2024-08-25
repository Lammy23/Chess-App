import React, { act, useEffect, useState } from "react";
import "./SidePanel.css";
import MoveStrip from "./MoveStrip";
import { useMovementContext } from "../context/MovementContext";
import { PieceNotation } from "../logic/Notation";
import { ChessCoordinate } from "../logic/Coordinates";

function SidePanel() {
  const [moveList, setMoveList] = useState([]);
  const {
    moveHistory,
    setMoveHistory,
    moveCount,
    boardHistory,
    setBoardHistory,
    lastMoveWasCapture,
    lastMoveWasCheck,
    lastMoveWasCheckmate,
    currentTurn,
    inEditMode,
  } = useMovementContext();

  useEffect(() => {
    // Took a while to figure out
    // Remove everything in front of the list
    if (inEditMode) {
      const activeMoveSet = Math.ceil(moveCount / 2);
      setMoveList((prev) => {
        return prev.filter((val, pos) => {
          return pos < activeMoveSet;
        });
      });
      setMoveHistory((prev) => {
        return prev.filter((val, pos) => {
          return pos < moveCount;
        });
      });
      setBoardHistory((prev) => {
        return prev.filter((val, pos) => {
          return pos < moveCount + 1;
        });
      });
    }
  }, [inEditMode, moveCount, setBoardHistory, setMoveHistory]);

  useEffect(() => {
    var activeMove = moveHistory[moveCount - 1];
    const activeMoveSet = Math.ceil(moveCount / 2);
    console.log(activeMoveSet);
    if (activeMove && inEditMode) {
      if (
        moveList[0] &&
        activeMoveSet <= moveList[moveList.length - 1].moveSetNumber
      ) {
        if (activeMoveSet * 2 === moveCount) {
          console.log("editing black");
          // Black
          setMoveList((prev) => {
            const working = prev[activeMoveSet - 1];
            working.blackMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        } else {
          console.log("editing white");
          // white
          setMoveList((prev) => {
            const working = prev[activeMoveSet - 1];
            working.whiteMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        }
      } else {
        console.log("new line");
        setMoveList((prev) => {
          prev[activeMoveSet - 1] = {
            moveSetNumber: activeMoveSet,
            whiteMove: new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn),
          };
          return [...prev];
        });
      }
    }
  }, [moveCount]);

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
