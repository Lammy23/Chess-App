import "./App.css";
import ChessBoard from "./components/ChessBoard";
import { MovementProvider } from "./context/MovementContext";

function App() {
  return (
    <MovementProvider>
      <div id="app">
        <ChessBoard />
      </div>
    </MovementProvider>
  );
}

export default App;
