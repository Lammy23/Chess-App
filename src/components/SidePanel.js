import React from "react";
import "./SidePanel.css";
import MoveStrip from "./MoveStrip";
import { useMovementContext } from "../context/MovementContext";

function SidePanel() {
  // const [moveList, setMoveList] = useState([]);
  const { moveList } = useMovementContext();

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
