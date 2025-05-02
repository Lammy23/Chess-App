import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./MenuScreen.css";

function MenuScreen() {
  let navigate = useNavigate();

  function handleStartGame() {
    navigate("/chess");
  }

  return (
    <div className="menu-screen">
      <Container className="menu-container">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="menu-card">
              <div className="chess-logo">
                <div className="chess-board-icon">
                  {Array(4)
                    .fill()
                    .map((_, rowIndex) => (
                      <div key={rowIndex} className="icon-row">
                        {Array(4)
                          .fill()
                          .map((_, colIndex) => (
                            <div
                              key={colIndex}
                              className={`icon-square ${
                                (rowIndex + colIndex) % 2 === 0
                                  ? "light-square"
                                  : "dark-square"
                              }`}
                            />
                          ))}
                      </div>
                    ))}
                </div>
              </div>

              <h1 className="title">Chess App</h1>
              <p className="subtitle">
                Work in progress!
              </p>

              <div className="menu-buttons">
                <Button
                  variant="primary"
                  size="lg"
                  className="start-button"
                  onClick={handleStartGame}
                >
                  Start Game
                </Button>
              </div>

              <div className="menu-footer">
                <p>By Olamikun and Aidan</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MenuScreen;
