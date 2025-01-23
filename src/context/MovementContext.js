// Importing React and React hooks
import React, { createContext, useContext, useEffect, useState } from "react";

// Importing the constants and classes that we need to use in this context
import {
  Color,
  files,
  ranks,
  soundFiles,
  startingChessPosition,
  // testingPromotionPosition,
  testingHybridPromotion,
} from "../components/constants";
import Referee from "../logic/Referee.js";
import { ChessPiece } from "../logic/Piece.js";
import { PieceNotation } from "../logic/Notation.js";
import { ChessCoordinate } from "../logic/Coordinates.js";
import { pawnPromotion } from "../logic/rules/pawnRules.js";

const MovementContext = createContext(); // Creating the Movement Context
const preloadedAudio = {}; // Creating an object to store preloaded audio files

// Creating and exporting a function that components can import in order to use variables and functions from this context.
export const useMovementContext = () => useContext(MovementContext);

/* TODO: Im pretty sure this is bad practice but im not sure how else I can keep track of the player turns => Fixed by using state variable */

export const MovementProvider = ({ children, appRef }) => {
  /* STATE VARIABLES */
  // Representing the board positions. New positions can be added dynamically
  const [boardState, setBoardState] = useState(null);

  // Storing the dive element that is currently being moved
  const [activePiece, setActivePiece] = useState(null);

  // Storing the original position of the piece that is currently being moved
  const [activePieceOrigin, setActivePieceOrigin] = useState("");

  // Storing the history of the moves as an array of objects
  const [moveHistory, setMoveHistory] = useState([]);

  // Storing the history of the board states as an array of objects
  const [boardHistory, setBoardHistory] = useState([]);

  // Storing the move count
  const [moveCount, setMoveCount] = useState(0);

  // Storing the last move details. TODO: How about a Move class?
  const [lastMoveWasCapture, setLastMoveWasCapture] = useState(false);
  const [lastMoveWasCheck, setLastMoveWasCheck] = useState(false);
  const [lastMoveWasCheckmate, setLastMoveWasCheckmate] = useState(false);
  const [lastMoveWasCastleKingSide, setLastMoveWasCastleKingSide] =
    useState(false);
  const [lastMoveWasCastleQueenSide, setLastMoveWasCastleQueenSide] =
    useState(false);

  // Storing the current turn
  const [currentTurn, setCurrentTurn] = useState(Color.white);

  // Storing the current mode
  const [inEditMode, setInEditMode] = useState(true);

  // Storing the move list
  const [moveNotations, setMoveNotations] = useState([]);

  // TODO: Combine most of these flags and variables using json objects

  // Storing the castle flags
  const [whiteKingMoved, setWhiteKingMoved] = useState(false);
  const [blackKingMoved, setBlackKingMoved] = useState(false);
  const [leftBlackRookMoved, setLeftBlackRookMoved] = useState(false);
  const [leftWhiteRookMoved, setLeftWhiteRookMoved] = useState(false);
  const [rightBlackRookMoved, setRightBlackRookMoved] = useState(false);
  const [rightWhiteRookMoved, setRightWhiteRookMoved] = useState(false);

  // Creating an instance of the referee class to check valide moves and what not. #TODO: Might refactor how I do this
  const referee = new Referee();

  /**
   * Function to preload the audio files
   * @param {string} sound The name of the sound file to preload
   */
  const preloadSound = (sound) => {
    preloadedAudio[sound] = new Audio(`assets/sounds/${sound}.mp3`);
    preloadedAudio[sound].load();
  };

  /**
   * Function to play the sound
   * @param {string} sound The name of the sound file to play
   */
  const playSound = (sound) => {
    const audio = preloadedAudio[sound];
    audio.currentTime = 0; // Reset to start
    audio.play();
  };

  /**
   * Function to toggle the current turn
   */
  const toggleCurrentTurn = () => {
    setCurrentTurn((prev) => Color.toggleColor(prev));
  };

  /**
   * Function to return various elements and properties of the chessboard div.
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
   * @param {String} positionX The x position of the piece
   * @param {String} positionY The y position of the piece
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
   * Function to undo the last move
   * @returns {boolean} Returns false if there are no moves to undo, else true
   */
  function undo() {
    // #TODO: Figure out how to also undo castle flags

    setInEditMode(false);

    // Checking if there are any moves to undo
    if (moveCount === 0) {
      return false;
    }

    // Playing the undo sound
    playSound(soundFiles["undo-redo"]);

    // Undo the move
    const newCount = moveCount - 1;
    setMoveCount(newCount);

    /* UseEffect automatically updates the boardState */

    // Toggling the turn
    toggleCurrentTurn();

    return true;
  }

  /**
   * Function to redo the last move
   * @returns {boolean} Returns false if there are no moves to redo, else true
   */
  function redo() {
    setInEditMode(false);

    // Checking if there are any moves to redo
    if (moveCount === boardHistory.length - 1) {
      return false;
    }

    // Playing the redo sound
    playSound(soundFiles["undo-redo"]);

    // Redo the move
    const newCount = moveCount + 1;
    setMoveCount(newCount);

    /* UseEffect automatically updates the boardState */

    // Toggling the turn
    toggleCurrentTurn();

    return true;
  }

  /**
   * Function to grab the piece. This function runs once.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e The event object
   * @param {String} position The position of the piece
   */
  function grabPiece(e, position) {
    // Preventing the default behavior of the event
    e.preventDefault();

    // Extracting the div element (chess tile) from the React event.
    const element = e.target;

    // Checking to see if we grabbed an actual piece on screen
    if (element.className === "piece-div") {
      // Extracting only the necessary variables from the getChessboardElements function
      const { tileWidth, tileHeight } = getChessboardElements();

      // Setting the origin of the active piece to a position (e.g. 'a1', 'e4')
      setActivePieceOrigin(position);

      // Grabbing the x and y coordinates of the mouse
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Setting the position to 'absolute' (from null), somewhat 'unlocking' its position. It can now move anywhere on the board.
      element.style.position = "absolute";

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
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e The event object
   */
  function movePiece(e) {
    // Preventing the default behavior of the event
    e.preventDefault();

    // DEBUG: Printing the file, rank that the piece is hovering over
    // if (activePiece) {
    //   let positionX = activePiece.style.left;
    //   let positionY = activePiece.style.top;
    //   console.log(
    //     coordinatesToFileAndRank(positionX, positionY, leftBound, topBound)
    //   );
    // }

    if (activePiece && activePiece.className === "piece-div") {
      // #TODO: This line of code below makes the game slow I think. Because this function is running multiple times a second.

      // Dropping the piece if no mouse button is clicked. This fixes the spam click bug.
      if (e.buttons === 0) {
        dropPiece();
      }

      // Extracting the necessary variables from the getChessboardElements function
      const {
        tileWidth,
        tileHeight,
        leftBound,
        topBound,
        rightBound,
        bottomBound,
      } = getChessboardElements();

      // Grabbing the x and y coordinates of the mouse
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Glueing the piece to the center of the mouse as long as it's within the bounds of the chessboard
      if (mouseX >= leftBound && mouseX <= rightBound)
        activePiece.style.left = `${mouseX - tileWidth / 2}px`;

      if (mouseY >= topBound && mouseY <= bottomBound)
        activePiece.style.top = `${mouseY - tileHeight / 2}px`;
    }
  }

  /**
   * Function to clear the history of the moves. Used when we want to rewind the game to a certain point.
   */
  const clearHistory = () => {
    // Took a while to figure out
    // Aiming to clear everything before the current move, leaving the current move as the first move
    setMoveNotations((prev) => {
      return prev.filter((val, pos) => {
        return pos < Math.ceil(moveCount / 2);
      });
    });

    setMoveHistory((prev) => {
      return prev.filter((val, pos) => {
        return pos < moveCount;
      });
    });

    setBoardHistory((prev) => {
      return prev.filter((val, pos) => {
        return pos < moveCount + 1;
      });
    });
  };

  const checkMove = (currentCoordinates) => {
    // Extracting the piece type from the boardState state using the activePieceOrigin
    const pieceType = boardState[activePieceOrigin];

    let pickedUpPiece;

    // Get the piece type from the boardState state using the activePieceOrigin

    let futureBoardState = { ...boardState };
    futureBoardState[currentCoordinates] = futureBoardState[activePieceOrigin];
    futureBoardState[activePieceOrigin] = null;

    const castleParameters = {
      leftWhiteRookMoved: leftWhiteRookMoved,
      rightWhiteRookMoved: rightWhiteRookMoved,
      leftBlackRookMoved: leftBlackRookMoved,
      rightBlackRookMoved: rightBlackRookMoved,
      whiteKingMoved: whiteKingMoved,
      blackKingMoved: blackKingMoved,
    };

    /* First of all, let's give the referee all the relevant info that it needs to do it's calculations */
    referee.updateRefereeContext({
      activePieceOrigin,
      currentCoordinates,
      boardState,
      futureBoardState,
      pieceType,
      moveHistory,
      castleParameters,
    });

    let soundToPlay;

    /* Referee will check if the piece it is trying to place down is being dropped in a valid position
        from its starting position */
    if (pieceType !== undefined && pieceType !== null) {
      if (pieceType.includes("_w")) {
        pickedUpPiece = Color.white;
      } else if (pieceType.includes("_b")) {
        pickedUpPiece = Color.black;
      }
    }
    if (referee.isMove() && currentTurn === pickedUpPiece) {
      soundToPlay = "mariojump";
      if (boardState[currentCoordinates]) {
        setLastMoveWasCapture(true);
      } else {
        setLastMoveWasCapture(false);
      }
      if (referee.isCheckingOpponent() || referee.isUnderCheck()) {
        setLastMoveWasCheck(true);
        soundToPlay = soundFiles["check"];
        if (referee.isCheckmatingOpponent()) {
          setLastMoveWasCheckmate(true);
          console.log("checkmate");
          soundToPlay = "englishorspanish";
        }
      } else {
        setLastMoveWasCheck(false);
      }

      playSound(soundToPlay);
      if (inEditMode === false) {
        clearHistory();
        setInEditMode(true);
      }
      const newCount = moveCount + 1;

      setBoardState((prev) => {
        /* If the piece is dropped in a new position and is not out of bounds, update the hashmap.
            This automatically triggers a re-render (as it's a state variable) */
        const oldCoordinates = prev[activePieceOrigin];
        const updatedPosition = {
          ...prev,
        }; /* Hard to figure piece of code that I documented in problems and solutions */
        updatedPosition[currentCoordinates] = oldCoordinates;
        updatedPosition[activePieceOrigin] = null;

        // Castle move (the only time where we move two pieces at once)
        if (referee.isCastle) {
          // console.log('castling time!');
          // console.log(referee.castleMoveDetails);

          if (referee.isCastleKingSide) {
            console.log("Was a castle");
            setLastMoveWasCastleKingSide(true);
          } else if (referee.isCastleQueenSide) {
            setLastMoveWasCastleQueenSide(true);
          }

          const currentRookCoordinates =
            referee.castleMoveDetails.currentRookCoordinates;
          const oldRookCoordinates =
            referee.castleMoveDetails.oldRookCoordinates;
          updatedPosition[currentRookCoordinates] = prev[oldRookCoordinates];
          updatedPosition[oldRookCoordinates] = null;
        }

        //Add board to list
        setMoveCount(newCount);
        setBoardHistory((prev) => {
          prev[newCount] = updatedPosition;
          return [...prev];
        });
        return updatedPosition;
      });

      setMoveHistory((prev) => [
        ...prev,
        {
          from: activePieceOrigin,
          to: currentCoordinates,
          piece: ChessPiece.getPiece(pieceType),
        },
      ]);

      //Player turns
      toggleCurrentTurn();
    } else {
      // Illegal move
    }
  };

  /**
   * Function to drop the piece. This function runs once.
   */
  function dropPiece() {
    // Checking if we're holding a piece
    if (activePiece) {
      // Extracting the necessary variables from the getChessboardElements function
      const { leftBound, topBound } = getChessboardElements();

      // Extracting the position of the piece
      let positionX = activePiece.style.left;
      let positionY = activePiece.style.top;

      // Converting the position of the piece to a file and rank
      const currentCoordinates = coordinatesToFileAndRank(
        positionX,
        positionY,
        leftBound,
        topBound
      );

      // Checking if the piece is being dropped in a new position and is not out of bounds
      if (currentCoordinates && currentCoordinates !== activePieceOrigin) {
        // Checking the validity of the move
        checkMove(currentCoordinates);
      }

      // Locking the piece in its new (or old) position and setting it inactive
      activePiece.style.position = null;
      activePiece.style.top = null;
      activePiece.style.left = null;
      setActivePiece(null);
    }
  }

  function promotePawn(position, chosenPiece, team) {
    // Check if the user has provided a promotion choice
    if (!chosenPiece) {
      console.error("Promotion choice is required!"); // Log an error if no piece is chosen
      return;
    }
  
    // Update the board state with the new promoted piece
    setBoardState((prevState) => ({
      ...prevState, // Preserve the rest of the board state
      [position]: `${chosenPiece}_${team === "white" ? "w" : "b"}`, // Replace the pawn with the chosen piece
    }));
  }
  

  // Improving Audio peformance on load
  useEffect(() => {
    preloadSound("mariojump");
    preloadSound("englishorspanish");
    preloadSound(soundFiles["check"]);
    preloadSound(soundFiles["undo-redo"]);
  }, []);

  // Setting the default position of the chess board upon loading the app
  useEffect(() => {
    setBoardState(() => {
      setBoardHistory((prev) => {
        // prev[0] = startingChessPosition;
        prev[0] = testingHybridPromotion
        return [...prev];
      });
      return startingChessPosition;
    });
  }, []);

  // Moving through the history of moves as the moveCount changes
  useEffect(() => {
    setBoardState(boardHistory[moveCount]);
  }, [boardHistory, moveCount]);

  // Updating the move notations as the moveCount changes
  useEffect(() => {
    var activeMove = moveHistory[moveCount - 1];
    const activeMoveSet = Math.ceil(moveCount / 2);
    if (activeMove && inEditMode) {
      if (
        moveNotations[0] &&
        activeMoveSet <= moveNotations[moveNotations.length - 1].moveSetNumber
      ) {
        if (activeMoveSet * 2 === moveCount) {
          // Black
          setMoveNotations((prev) => {
            const working = prev[activeMoveSet - 1];
            working.blackMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate,
              lastMoveWasCastleKingSide,
              lastMoveWasCastleQueenSide
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        } else {
          // white
          setMoveNotations((prev) => {
            const working = prev[activeMoveSet - 1];
            working.whiteMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate,
              lastMoveWasCastleKingSide,
              lastMoveWasCastleQueenSide
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        }
      } else {
        setMoveNotations((prev) => {
          prev[activeMoveSet - 1] = {
            moveSetNumber: activeMoveSet,
            whiteMove: new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate,
              lastMoveWasCastleKingSide,
              lastMoveWasCastleQueenSide
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn),
          };
          return [...prev];
        });
      }
    }
  }, [moveCount]);

  // Updating the castle flags as the boardState changes
  useEffect(() => {
    if (boardState) {
      if (boardState.a1 !== "rook_w") {
        setLeftWhiteRookMoved(true);
      }
      if (boardState.h1 !== "rook_w") {
        setRightWhiteRookMoved(true);
      }
      if (boardState.a8 !== "rook_b") {
        setLeftBlackRookMoved(true);
      }
      if (boardState.h8 !== "rook_b") {
        setRightBlackRookMoved(true);
      }
      if (boardState.e1 !== "king_w") {
        setWhiteKingMoved(true);
      }
      if (boardState.e8 !== "king_b") {
        setBlackKingMoved(true);
      }

      // DEBUG
      // console.log("White");
      // console.log('leftWhiteRookMoved', leftWhiteRookMoved);
      // console.log('rightWhiteRookMoved', rightWhiteRookMoved);
      // console.log('whiteKingMoved', whiteKingMoved);

      // console.log("Black");
      // console.log('leftBlackRookMoved', leftBlackRookMoved);
      // console.log('rightBlackRookMoved', rightBlackRookMoved);
      // console.log('blackKingMoved', blackKingMoved);

      // console.log(boardState);
    }
  }, [boardState]);

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
        promotePawn,
        moveCount,
        setMoveCount,
        boardState,
        boardHistory,
        setBoardHistory,
        moveHistory,
        setMoveHistory,
        undo,
        redo,
        lastMoveWasCapture,
        lastMoveWasCheck,
        lastMoveWasCheckmate,
        currentTurn,
        setCurrentTurn,
        inEditMode,
        setInEditMode,
        moveNotations,
        setMoveNotations,
        playSound,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
