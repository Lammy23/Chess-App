import React from "react";
import ChessBoard from "./components/ChessBoard";
import { MovementProvider } from "./context/MovementContext";

import "./App.css";

function App() {
  return (
    <MovementProvider>
      <div>
        <ChessBoard />
      </div>
    </MovementProvider>
  );
}

export default App;
