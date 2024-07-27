import React, { useRef } from "react";
import ChessBoard from "./components/ChessBoard";
import { MovementProvider } from "./context/MovementContext";

import "./App.css";

function App() {
  const appRef = useRef(); // Using a new React Hook useRef (as in use reference)
  
  /*
  useRef allows us to manipulate DOM elements. 
  Here, I'm passing the entire app div (which is probably not ideal)
  */
  
  return (
    <MovementProvider appRef={appRef}> {/* Passing the div as a prop to the MovementContext (Logic) so that it know the dimensions (for out of bounds programming) */}
      <div ref={appRef}> {/* Telling useRef to use this div as the reference */}
        <ChessBoard />
      </div>
    </MovementProvider>
  );
}

export default App;
