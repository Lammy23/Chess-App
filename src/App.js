import React, { useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import { MovementProvider } from "./context/MovementContext";

import "./App.css";

function App() {
  const appRef = useRef();
  
  return (
    <MovementProvider appRef={appRef}>
      <div ref={appRef}>
        <ChessBoard />
      </div>
    </MovementProvider>
  );
}

export default App;
