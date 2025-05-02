import React from "react";
import "./SidePanel.css";
import MoveStrip from "./MoveStrip";
import { useMovementContext } from "../context/MovementContext";

function SidePanel() {
  // const [moveNotations, setMoveNotations] = useState([]);
  const { moveNotations } = useMovementContext();

  return (
    <div id="side-panel" className="background">
      {moveNotations.map(({ moveSetNumber, whiteMove, blackMove }) => {
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
