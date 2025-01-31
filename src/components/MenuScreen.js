import React from "react";
import { useNavigate } from "react-router-dom";

function MenuScreen() {
  let navigate = useNavigate();

  function handleStartGame() {
    // Start the game
    navigate('/chess')
  }

  return (
    <>
      <div>Welcome to Chess</div>
      <button onClick={handleStartGame}>Start</button>
    </>
  );
}

export default MenuScreen;
