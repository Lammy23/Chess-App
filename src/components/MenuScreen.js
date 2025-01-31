import React from "react";
import { useNavigate } from "react-router-dom";

// Bootstrap
import Button from "react-bootstrap/Button";

function MenuScreen() {
  let navigate = useNavigate();

  function handleStartGame() {
    // Start the game
    navigate("/chess");
  }

  return (
    <>
      <div>Welcome to Chess</div>
      <Button variant="primary" className="" onClick={handleStartGame}>
        Start Game
      </Button>
    </>
  );
}

export default MenuScreen;
