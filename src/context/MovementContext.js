import React, { createContext, useContext, useEffect, useState } from "react";

import { files, ranks } from "../components/constants";
import Referee from "../logic/Referee.js";

const MovementContext = createContext(); // Creating the Movement Context

// Creating and exporting a function that components can import in order to use variables and functions from this context.
export const useMovementContext = () => useContext(MovementContext);

// export const PieceType = { //List of Chess pieces used for determining the valid moves for referee
//   KING: 'KING',
//   QUEEN: 'QUEEN',
//   BISHOP: 'BISHOP',
//   KNIGHT: 'KNIGHT',
//   ROOK: 'ROOK',
//   PAWN: 'PAWN'
// };

// export const TeamType = {
//   WHITE: 'WHITE',
//   BLACK: 'BLACK',
// }

export const MovementProvider = ({ children, appRef }) => {
  const [boardState, setBoardState] =
    useState(
      null
    ); /* A Hashmap representing starting positions. New positions can be added dynamically */
  const [activePiece, setActivePiece] =
    useState(null); /* The div element that is the active piece */
  const [activePieceOrigin, setActivePieceOrigin] =
    useState(""); /* The position string that the active piece came from */
  const [moveHistory, setMoveHistory] = useState([]);
  const referee = new Referee(); //Instance of referee to check the movement of pieces

  const playSound = (sound) => {
    // const audio = new Audio(`assets/sounds/${sound}.mp3`);
    // audio.play();
  };

  /**
   * This function returns various elements and properties of the chessboard div.
   * #TODO: The constants created here don't ever change so I should probably find a way to calculate them and store them somewhere. maybe useEffect would be helpful?
   * @returns {object} Object containing the chessboard div, chess tile div, tile width, tile height, left bound, top bound, right bound and bottom bound
   */
  function getChessboardElements() {
    const chessboardDiv = appRef.current.children[0].children[0]; // Extracting the chessboard div
    const chesstileDiv = chessboardDiv.children[0]; // Extracting the first chess tile div.

    const tileWidth = chesstileDiv.clientWidth; // Calculating the width of the first chess tile. Since they're all uniform it shouldn't be a problem
    const tileHeight = chesstileDiv.clientHeight; // Calculating the height of the first chess tile.

    const leftBound = chessboardDiv.offsetLeft; // Calculating the coordinates of the left edge of the board.
    const topBound = chessboardDiv.offsetTop; // Calculating the coordinates of the top edge of the board.
    const rightBound = leftBound + chessboardDiv.clientWidth; // "" "" of the right edge.
    const bottomBound = topBound + chessboardDiv.clientHeight; // "" "" of the bottom edge.

    return {
      chessboardDiv,
      chesstileDiv,
      tileWidth,
      tileHeight,
      leftBound,
      topBound,
      rightBound,
      bottomBound,
    };
  }

  /**
   * Function to convert the position of the piece to a file and rank
   * @param {String} positionX
   * @param {String} positionY
   * @returns {string | null} String of file and rank if the position is valid, else null
   */
  function coordinatesToFileAndRank(positionX, positionY) {
    const { tileWidth, tileHeight, leftBound, topBound } =
      getChessboardElements();

    // Extract the coordinates

    var x = parseInt(positionX.slice(0, positionX.length - 2));
    var y = parseInt(positionY.slice(0, positionY.length - 2));

    // Account for the board offset and piece center

    x = x - leftBound + tileWidth / 2;
    y = y - topBound + tileHeight / 2;

    // Account for size of tile

    x = Math.floor(x / tileWidth);
    y = Math.floor(y / tileHeight);

    // Flip y presentation (to fix error)

    y = 7 - y;

    // Get ranking and filing

    x = files[x];
    y = ranks[y];

    if (x && y) return `${x}${y}`;
    else return null;
  }

  /**
   * Function to grab the piece. This function runs once.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
   * @param {String} position
   */
  function grabPiece(e, position) {
    e.preventDefault();
    const element = e.target; // Extracting the div element (chess tile) from the React event.

    if (element.className === "piece-div") {
      // Checking to see if we grabbed an actual piece

      const { tileWidth, tileHeight } = getChessboardElements(); // Extracting only needed variables from function
      setActivePieceOrigin(position); // Setting the origin of the active piece to a position (e.g. 'a1', 'e4')

      const mouseX = e.clientX; // Grabbing the x coordinates of the mouse
      const mouseY = e.clientY; // Grabbing the y coordinates of the mouse

      element.style.position = "absolute"; // Setting 'absolute' position (from null), somewhat 'unlocking' its position. It can now move anywhere on the board.

      // Creating offset to center the piece with the mouse
      element.style.top = `${mouseY - tileHeight / 2}px`;
      element.style.left = `${mouseX - tileWidth / 2}px`;
    }

    setActivePiece(element); // Assigning the state variable.

    /* Setting state variables happen asynchronously, so we try to assign them at the end.
    For example, we couldn't assign it first then use activePiece as a variable because React might
    use a previous state of that variable. */
  }

  /**
   * Function to move the piece. This function runs multiple times a second.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
   */
  function movePiece(e) {
    e.preventDefault();
    // In true baller fashion, we want to print the position (file + rank) that the piece is hovering on
    // DEBUG
    // if (activePiece) {
    //   let positionX = activePiece.style.left;
    //   let positionY = activePiece.style.top;
    //   console.log(
    //     coordinatesToFileAndRank(positionX, positionY, leftBound, topBound)
    //   );
    // }

    if (activePiece && activePiece.className === "piece-div") {
      // #TODO: This line of code below makes the game slow I think. Because this function is running multiple times a second.

      // If no mouse button is clicked, drop the piece. This fixes the spam click bug.
      if (e.buttons === 0) {
        dropPiece();
      }

      const {
        tileWidth,
        tileHeight,
        leftBound,
        topBound,
        rightBound,
        bottomBound,
      } = getChessboardElements();

      const mouseX = e.clientX; // Getting the x coordinates of the mouse
      const mouseY = e.clientY; // Getting the y coordinates of the mouse

      /* If the mouse is within the bounds, let the piece follow the center of the mouse */
      if (mouseX >= leftBound && mouseX <= rightBound)
        activePiece.style.left = `${mouseX - tileWidth / 2}px`;

      if (mouseY >= topBound && mouseY <= bottomBound)
        activePiece.style.top = `${mouseY - tileHeight / 2}px`;
    }
  }

  /**
   * Function to drop the piece. This function runs once.
   */
  function dropPiece() {
    if (activePiece) {
      // Checking if we're holding a piece
      const pieceType = boardState[activePieceOrigin]; // Accessing the hashmap to get the piece type
      const { leftBound, topBound } = getChessboardElements(); // Extracting only needed variables from function

      let positionX = activePiece.style.left;
      let positionY = activePiece.style.top;

      const currentCoordinates = coordinatesToFileAndRank(
        positionX,
        positionY,
        leftBound,
        topBound
      );

      if (currentCoordinates && currentCoordinates !== activePieceOrigin) {
        // Get the piece type from the boardState state using the activePieceOrigin

        let futureBoardState = { ...boardState };
        futureBoardState[currentCoordinates] =
          futureBoardState[activePieceOrigin];
        futureBoardState[activePieceOrigin] = null;

        /* First of all, let's give the referee all the relevant info that it needs to do it's calculations */
        referee.updateRefereeContext({
          activePieceOrigin,
          currentCoordinates,
          boardState,
          futureBoardState,
          pieceType,
          moveHistory,
        });

        /* Referee will check if the piece it is trying to place down is being dropped in a valid position
        from its starting position */
        if (referee.isMove()) {
          playSound("pipes");
          if (referee.isChecking(referee.getPossibleMoves())) {
            playSound("mewing");
          }
          setBoardState((prev) => {
            /* If the piece is dropped in a new position and is not out of bounds, update the hashmap.
            This automatically triggers a re-render (as it's a state variable) */
            const oldCoordinates = prev[activePieceOrigin];
            const updatedPosition = {
              ...prev,
            }; /* Hard to figure piece of code that I documented in problems and solutions */
            updatedPosition[currentCoordinates] = oldCoordinates;
            updatedPosition[activePieceOrigin] = null;
            return updatedPosition;
          });

          setMoveHistory((prev) => [
            ...prev,
            {
              from: activePieceOrigin,
              to: currentCoordinates,
              piece: pieceType,
            },
          ]);
          console.log("moveHistory", moveHistory);
        } else {
          playSound("buzzer"); //Sound queue for illegal moves
        }
      }
      // Will reset piece if the position isn't updated
      activePiece.style.position = null;
      activePiece.style.top = null;
      activePiece.style.left = null;
      setActivePiece(null); // Remove the active piece.
    }
  }

  useEffect(() => {
    /* Upon loading the app, this should be the default position of the chess board */
    setBoardState({
      // Hashmap representing starting positions, will update every position for each piece when moved
      a1: "rook_w",
      b1: "knight_w",
      c1: "bishop_w",
      d1: "queen_w",
      e1: "king_w",
      f1: "bishop_w",
      g1: "knight_w",
      h1: "rook_w",
      a2: "pawn_w",
      b2: "pawn_w",
      c2: "pawn_w",
      d2: "pawn_w",
      e2: "pawn_w",
      f2: "pawn_w",
      g2: "pawn_w",
      h2: "pawn_w",
      a7: "pawn_b",
      b7: "pawn_b",
      c7: "pawn_b",
      d7: "pawn_b",
      e7: "pawn_b",
      f7: "pawn_b",
      g7: "pawn_b",
      h7: "pawn_b",
      a8: "rook_b",
      b8: "knight_b",
      c8: "bishop_b",
      d8: "queen_b",
      e8: "king_b",
      f8: "bishop_b",
      g8: "knight_b",
      h8: "rook_b",
    });
  }, []);

  return (
    <MovementContext.Provider // Providing function and variables for other components to use.
      value={{
        activePiece,
        activePieceOrigin,
        setActivePiece,
        setActivePieceOrigin,
        grabPiece,
        movePiece,
        dropPiece,
        boardState,
        moveHistory,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
