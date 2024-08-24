import React from "react";
import "./SidePanel.css";
import "./MoveStrip.css";

function MoveStrip({ moveSetNumber, whiteMove, blackMove }) {
  const getBackgroundColor = () => {
    return parseInt(moveSetNumber) % 2 === 0 ? "#2e2d2b" : "#2a2927";
  };
  return (
    <div
      id="move-strip"
      className="background"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div>{moveSetNumber}.</div>
      <div>{whiteMove}</div>
      <div>{blackMove}</div>
    </div>
  );
}

export default MoveStrip;
