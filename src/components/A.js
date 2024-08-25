import React from "react";
import "./A.css";

function A() {
  return (
    <React.Fragment>
      <div id={"a"}>Hello</div>
      <div id={"grid"}>
        <div id={'special'}>a</div>
        <div>
          <div id={"special"}>b</div>
        </div>
        <div>c</div>
      </div>
    </React.Fragment>
  );
}

export default A;
