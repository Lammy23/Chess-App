import React, { createContext, useContext, useEffect, useState } from "react";

import { Color, files, ranks } from "../components/constants";
import Referee from "../logic/Referee.js";
import { ChessPiece } from "../logic/Piece.js";
import { PieceNotation } from "../logic/Notation.js";
import { ChessCoordinate } from "../logic/Coordinates.js";

const MovementContext = createContext(); // Creating the Movement Context
const preloadedAudio = {};

// Creating and exporting a function that components can import in order to use variables and functions from this context.
export const useMovementContext = () => useContext(MovementContext);
// Im pretty sure this is bad practice but im not sure how else I can keep track of the player turns => Fixed by using state variable

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
  const [boardHistory, setBoardHistory] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const referee = new Referee(); //Instance of referee to check the movement of pieces

  const [lastMoveWasCapture, setLastMoveWasCapture] = useState(false);
  const [lastMoveWasCheck, setLastMoveWasCheck] = useState(false);
  const [lastMoveWasCheckmate, setLastMoveWasCheckmate] = useState(false);

  const [currentTurn, setCurrentTurn] = useState(Color.white);
  const [inEditMode, setInEditMode] = useState(true);
  const [moveList, setMoveList] = useState([]);

  // const playSound = (sound) => {
  //   const audio = new Audio(`assets/sounds/${sound}.mp3`);
  //   audio.play();
  // };

  const preloadSound = (sound) => {
    preloadedAudio[sound] = new Audio(`assets/sounds/${sound}.mp3`);
    preloadedAudio[sound].load();
  };

  const playSound = (sound) => {
    const audio = preloadedAudio[sound];
    audio.currentTime = 0; // Reset to start
    audio.play();
  };

  const toggleCurrentTurn = () => {
    setCurrentTurn((prev) => Color.toggleColor(prev));
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

  function undo() {
    setInEditMode(false);
    if (moveCount === 0) return false;
    const newCount = moveCount - 1;
    setMoveCount(newCount);
    // setBoardState(boardHistory[newCount]);

    // reflect turns
    toggleCurrentTurn();
  }

  function redo() {
    setInEditMode(false);
    if (moveCount === boardHistory.length - 1) return false;
    const newCount = moveCount + 1;
    setMoveCount(newCount);
    // setBoardState(boardHistory[newCount]);

    // reflect turns
    toggleCurrentTurn();
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

  const clearHistory = () => {
    // Took a while to figure out
    // Remove everything in front of the list
    const activeMoveSet = Math.ceil(moveCount / 2);
    setMoveList((prev) => {
      return prev.filter((val, pos) => {
        return pos < activeMoveSet;
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

  /**
   * Function to drop the piece. This function runs once.
   */
  function dropPiece() {
    if (activePiece) {
      let pickedUpPiece;
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
            soundToPlay = "getout";
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
      }
      // Will reset piece if the position isn't updated
      activePiece.style.position = null;
      activePiece.style.top = null;
      activePiece.style.left = null;
      setActivePiece(null); // Remove the active piece.
    }
  }

  // Audio peformance improvements
  useEffect(() => {
    preloadSound("mariojump");
    preloadSound("englishorspanish");
    preloadSound("getout");
  }, []);

  useEffect(() => {
    // Preload other sounds
    /* Upon loading the app, this should be the default position of the chess board */
    setBoardState(() => {
      setBoardHistory((prev) => {
        prev[moveCount] = {
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
        };
        return [...prev];
      });
      return {
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
      };
    });
  }, []);

  useEffect(() => {
    setBoardState(boardHistory[moveCount]);
  }, [moveCount]);

  useEffect(() => {
    var activeMove = moveHistory[moveCount - 1];
    const activeMoveSet = Math.ceil(moveCount / 2);
    if (activeMove && inEditMode) {
      if (
        moveList[0] &&
        activeMoveSet <= moveList[moveList.length - 1].moveSetNumber
      ) {
        if (activeMoveSet * 2 === moveCount) {
          // Black
          setMoveList((prev) => {
            const working = prev[activeMoveSet - 1];
            working.blackMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        } else {
          console.log("editing white");
          // white
          setMoveList((prev) => {
            const working = prev[activeMoveSet - 1];
            working.whiteMove = new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn);
            return [...prev];
          });
        }
      } else {
        setMoveList((prev) => {
          prev[activeMoveSet - 1] = {
            moveSetNumber: activeMoveSet,
            whiteMove: new PieceNotation(
              activeMove.piece,
              new ChessCoordinate(activeMove.from),
              new ChessCoordinate(activeMove.to),
              lastMoveWasCapture,
              lastMoveWasCheck,
              lastMoveWasCheckmate
            ).calculateNotation(boardHistory[moveCount - 1], currentTurn),
          };
          return [...prev];
        });
      }
    }
  }, [moveCount]);

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
        moveList,
        setMoveList,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
