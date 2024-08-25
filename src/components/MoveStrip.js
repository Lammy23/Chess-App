import React from "react";
import "./SidePanel.css";
import "./MoveStrip.css";
import MoveNotation from "./MoveNotation";
import { Color } from "./constants";

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
      <div>
        <MoveNotation
          moveNotation={whiteMove}
          color={Color.white}
          moveSetNumber={moveSetNumber}
        />
      </div>
      <div>
        <MoveNotation
          moveNotation={blackMove}
          color={Color.black}
          moveSetNumber={moveSetNumber}
        />
      </div>
    </div>
  );
}

export default MoveStrip;
