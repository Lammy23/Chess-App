import { allChessCoordinates, deepEqual } from "../components/constants";
import { bishopMove, possibleBishopMoves } from "./rules/bishopRules";
import { kingMove, possibleKingMoves } from "./rules/kingRules";
import { possibleKnightMoves, knightMove } from "./rules/knightRules";
import {
  pawnMove,
  possiblePawnCaptures,
  possiblePawnMoves,
  validEnPassant,
} from "./rules/pawnRules";
import { possibleQueenMoves, queenMove } from "./rules/queenRules";
import { possibleRookMoves, rookMove } from "./rules/rookRules";

export default class Referee {
  // Fields
  #refContext = {};

  #getEnemyKingCoordinates(teamColour) {
    const ourColor = teamColour ? teamColour : this.#refContext.teamColour;
    const enemyColor = ourColor === "WHITE" ? "b" : "w";
    for (let coordinate of allChessCoordinates) {
      if (
        this.#refContext.futureBoardState[coordinate] === `king_${enemyColor}`
      ) {
        return coordinate;
      }
    }
  }

  // Methods
  updateRefereeContext = ({
    activePieceOrigin,
    currentCoordinates,
    boardState,
    futureBoardState,
    pieceType,
    moveHistory,
  }) => {
    //#SUGGESTION: Might be a better way to extract from hashmap?
    this.#refContext = {
      // Private variables
      previousFile: this.extractFile(activePieceOrigin),
      previousRank: this.extractRank(activePieceOrigin),
      currentFile: this.extractFile(currentCoordinates),
      currentRank: this.extractRank(currentCoordinates),
      teamColour: this.extractTeamColour(pieceType),
      moveHistory: moveHistory,
      pieceType: pieceType,
      boardState: boardState,
      futureBoardState: futureBoardState,
    };

    this.#refContext.previousFileNumber = this.fileToNumber(
      this.#refContext.previousFile
    );
    this.#refContext.currentFileNumber = this.fileToNumber(
      this.#refContext.currentFile
    );
  };

  /**
   * Helper function for determing if a piece is occupying a certain tile
   * @param {string} tileX
   * @param {number} tileY
   * @param {object} boardState
   * @returns {boolean} true if the tile is occupied, false otherwise
   */
  tileIsOccupied(tileX, tileY, boardState) {
    const tileKey = `${tileX}${tileY}`;
    //If the tile is not empty, then it is occupied
    return boardState[tileKey] !== undefined && boardState[tileKey] !== null;
  }

  tileIsOccupiedByOwn(coordinate, boardState) {
    const piece = boardState[coordinate];
    if (
      piece &&
      this.extractTeamColour(piece) === this.#refContext.teamColour
    ) {
      return true;
    }
    return false;
  }

  /**
   * Helper function for determining if the tile being attacked is the same colour as the piece attacking it
   * @param {string} tileX
   * @param {number} tileY
   * @param {object} boardState
   * @param {string} TeamType
   * @returns {boolean} true if the tile is occupied by an opponent, false otherwise
   */
  tileIsOccupiedByOpponent(tileX, tileY, boardState, TeamType) {
    const tileKey = `${tileX}${tileY}`;
    if (this.extractTeamColour(boardState[tileKey]) === TeamType) {
      return false;
    }
    return true;
  }

  isPawnMove = () => pawnMove.apply(this, [this.#refContext]);
  isKingMove = () => kingMove.apply(this, [this.#refContext]);
  isBishopMove = () => bishopMove.apply(this, [this.#refContext]);
  isRookMove = () => rookMove.apply(this, [this.#refContext]);
  isQueenMove = () => queenMove.apply(this, [this.#refContext]);
  isKnightMove = () => knightMove.apply(this, [this.#refContext]);

  /**
   *
   * @param {ChessCoordinate} coordinate
   * @returns
   */
  getPossibleDiagonalMoves(coordinate) {
    // Assuming coordinate is of type ChessCoordinate

    let futureBoardState = this.#refContext.futureBoardState;
    let teamColour = this.#refContext.teamColour;

    let moveList = [];
    let moveMap = [];
    let origin = coordinate.coordinate;

    let x = [-1, 1, -1, 1];
    let y = [1, 1, -1, -1];

    for (let i = 0; i < x.length; i++) {
      do {
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
        coordinate.plus({ fileStep: x[i], rankStep: y[i] });
      } while (
        !(coordinate.isOccupied({ futureBoardState }) || coordinate.isEdge())
      );

      if (coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })) {
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
      }

      coordinate.setCoordinate(origin);
    }

    return { moveList: moveList, moveMap: moveMap };
  }

  getPossibleCrossMoves(coordinate) {
    // Assuming coordinate is of type ChessCoordinate

    let futureBoardState = this.#refContext.futureBoardState;
    let teamColour = this.#refContext.teamColour;

    const moveList = [];
    const moveMap = [];
    let origin = coordinate.coordinate;

    let x = [1, -1];

    for (let i = 0; i < x.length; i++) {
      do {
        // horizontal movement
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
        coordinate.plus({ fileStep: x[i], rankStep: 0 });
      } while (
        !(
          coordinate.isOccupied({ futureBoardState }) || coordinate.isFileEdge()
        )
      );
      if (coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })) {
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
      }

      coordinate.setCoordinate(origin);

      do {
        // vertical movement
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
        coordinate.plus({ fileStep: 0, rankStep: x[i] });
      } while (
        !(
          coordinate.isOccupied({ futureBoardState }) || coordinate.isRankEdge()
        )
      );
      if (coordinate.isOccupiedByOpponent({ futureBoardState, teamColour })) {
        moveList.push(coordinate.coordinate);
        moveMap.push({
          from: origin,
          to: coordinate.coordinate,
        });
      }

      coordinate.setCoordinate(origin);
    }

    return { moveList: moveList, moveMap: moveMap };
  }

  // Provide temporary modified reference context
  modifyRefContext = (teamColour, refContext) => {
    refContext.teamColour = teamColour;
    return refContext;
  };

  getPossibleKnightMove = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possibleKnightMoves.apply(this, [refContext]);
  };
  getPossibleBishopMoves = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possibleBishopMoves.apply(this, [refContext]);
  };
  getPossibleRookMoves = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possibleRookMoves.apply(this, [refContext]);
  };
  getPossibleQueenMoves = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possibleQueenMoves.apply(this, [refContext]);
  };
  getPossiblePawnCaptures = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possiblePawnCaptures.apply(this, [refContext]);
  };
  getPossibleKingMoves = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possibleKingMoves.apply(this, [refContext]);
  };
  getPossiblePawnMoves = (teamColour) => {
    let refContext = this.modifyRefContext(teamColour, this.#refContext);
    return possiblePawnMoves.apply(this, [refContext]);
  };

  isValidEnPassant = () => validEnPassant.apply(this, [this.#refContext]);

  /**
   * Determines if a move is valid based on the coordinates, piece type and the board state
   * @param {string} previousCoordinates
   * @param {string} currentCoordinates
   * @param {string} pieceType
   * @param {object} boardState
   * @returns {boolean} true if the move is valid, false otherwise
   */
  isMove() {
    //#SUGGESTION: Change all if statements to else ifs

    let pieceType = this.#refContext.pieceType;

    // #DEBUGGING
    // Logging the coordinates and piece types
    // let previousCoordinates =
    //   this.#refContext.previousFile + this.#refContext.previousRank;
    // let currentCoordinates =
    //   this.#refContext.currentFile + this.#refContext.currentRank;
    // console.log("Previous Location: ", { previousCoordinates });
    // console.log("Current Location: ", { currentCoordinates });
    // console.log("Piece Type: ", { pieceType });

    /*  
    Three layers:
    1. Is a valid normal move
    2. Are we in check? If so does this move get us out of check
    3. Are we checkmated?
    */

    const isValid = pawnMove({
      previousRank: this.previousRank,
      currentRank: this.currentRank,
      previousFile: this.previousFile,
      currentFile: this.currentFile,
      previousFileNumber: this.previousFileNumber,
      currentFileNumber: this.currentFileNumber,
      boardState: this.boardState,
      teamColour: this.teamColour,
      moveHistory: this.moveHistory, // Pass move history to pawnMove function
    });
    if (pieceType === "pawn_w" || pieceType === "pawn_b") {
      // Checking pawn move
      return this.isPawnMove();
    }

    if (pieceType === "king_w" || pieceType === "king_b") {
      // Checking king move
      return this.isKingMove();
    }

    //Bishop Movement Logic
    if (pieceType === "bishop_w" || pieceType === "bishop_b") {
      return this.isBishopMove();
    }
    //Rook Movement Logic
    if (pieceType === "rook_w" || pieceType === "rook_b") {
      return this.isRookMove();
    }

    //Queen Movement Logic
    if (pieceType === "queen_w" || pieceType === "queen_b") {
      return this.isQueenMove();
    }

    //Logic for Knight movement (placeholder)
    if (pieceType === "knight_w" || pieceType === "knight_b") {
      return this.isKnightMove();
    }

    return isValid;
  }

  // #TODO: moves could be private field
  getPossibleMoves(teamColour) {
    const moves = [];
    moves.push(...this.getPossibleKnightMove(teamColour).moveMap);
    moves.push(...this.getPossibleBishopMoves(teamColour).moveMap);
    moves.push(...this.getPossibleRookMoves(teamColour).moveMap);
    moves.push(...this.getPossibleQueenMoves(teamColour).moveMap);
    moves.push(...this.getPossibleKingMoves(teamColour).moveMap);
    moves.push(...this.getPossiblePawnMoves(teamColour).moveMap);
    moves.push(...this.getPossiblePawnCaptures(teamColour).moveMap);

    return moves;
  }

  getPossibleCaptures(teamColour) {
    const moves = [];
    moves.push(...this.getPossibleKnightMove(teamColour).moveList);
    moves.push(...this.getPossibleBishopMoves(teamColour).moveList);
    moves.push(...this.getPossibleRookMoves(teamColour).moveList);
    moves.push(...this.getPossibleQueenMoves(teamColour).moveList);
    moves.push(...this.getPossibleKingMoves(teamColour).moveList);
    moves.push(...this.getPossiblePawnCaptures(teamColour).moveList);

    return moves;
  }

  isCheckingOpponent(teamColour) {
    // Checking if king is part of possible moves.
    // first find king
    const ourColor = teamColour ? teamColour : this.#refContext.teamColour;
    const moves = this.getPossibleCaptures(ourColor);
    const enemyKingCoordinates = this.#getEnemyKingCoordinates(ourColor);
    for (let coordinate of moves) {
      if (coordinate === enemyKingCoordinates) {
        return true;
      }
    }
    return false;
  }

  isUnderCheck(teamColour) {
    const ourColor = teamColour ? teamColour : this.#refContext.teamColour;
    const enemyColor = ourColor === "WHITE" ? "BLACK" : "WHITE";
    // Confirm enemy is checking our king
    return this.isCheckingOpponent(enemyColor);
  }

  isCheckmatingOpponent(teamColour) {
    var isCheckmated = true;
    // For all of our possible moves if made, see if we're still under check.
    const ourColor = teamColour ? teamColour : this.#refContext.teamColour;
    const enemyColor = ourColor === "WHITE" ? "BLACK" : "WHITE";
    const moves = this.getPossibleMoves(enemyColor);

    const originalBoard = { ...this.#refContext.futureBoardState };
    const project = (move) => {
      this.#refContext.futureBoardState[move.to] =
        this.#refContext.futureBoardState[move.from];
      this.#refContext.futureBoardState[move.from] = null;
    };

    const reset = () =>
      (this.#refContext.futureBoardState = { ...originalBoard });

    for (let move of moves) {
      project(move);
      // Check if we're under check
      if (!this.isUnderCheck(enemyColor)) {
        isCheckmated = false;
        break;
      }
      reset();
    }

    if (deepEqual(this.#refContext.futureBoardState, originalBoard)) {
      console.log("isCheckmated", isCheckmated);
    }

    return isCheckmated;
  }

  /**
   *  Determines if en passant is a valid move based on the coordinates, piece type and the board state
   * @param {string} tileX
   * @param {number} tileY
   * @param {object} boardState
   * @param {string} TeamType
   * @returns {boolean} true if the move is valid, false otherwise
   */
  //Determining if the move from a pawn can use En Passant
  // validEnPassant(tileX, tileY, boardState, TeamType) {
  //   const tileKey = `${tileX}${tileY}`;
  //   const attackableOpposingPawn = TeamType === "WHITE" ? "pawn_b" : "pawn_w";
  //   if (boardState[tileKey] === attackableOpposingPawn) {
  //     return true;
  //   }
  //   return false;
  // }

  //Extracting the Rank from the coordinate given
  /**
   * Extracts the rank from the coordinate given
   * @param {string} coordinate
   * @returns {number | null} the rank of the coordinate or null if no match is found
   */
  extractRank(coordinate) {
    const match = coordinate.match(/\d+/); //regular expression for splitting the coordinate
    //Conditional for whether a match is found, returns the rank only if a match is found, null otherwise
    return match ? parseInt(match[0], 10) : null;
  }

  //Extracting the File from the coordinate given
  extractFile(coordinate) {
    const match = coordinate.match(/[a-h]/); //regular expression for splitting the coordinate
    //Conditional for whether a match is found, returns the file only if a match is found, null otherwise
    return match ? match[0] : null;
  }

  //Extracts the team colour based on the piece given
  extractTeamColour(pieceType) {
    if (pieceType.includes("_w")) {
      return "WHITE";
    } else if (pieceType.includes("_b")) {
      return "BLACK";
    }
    //Returns null if some piece does not follow the naming convention
    return null;
  }
  //Turning the alphabetical value to a numerical value for easy calculations
  fileToNumber(file) {
    const fileMapping = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
    };
    //Returns value if the corresponding key is found, null otherwise
    return fileMapping[file] || null;
  }
  //Turning a numerical value to a alphabetical value for easy calculations
  numberToFile(number) {
    const numberMapping = {
      1: "a",
      2: "b",
      3: "c",
      4: "d",
      5: "e",
      6: "f",
      7: "g",
      8: "h",
    };
    //Returns value if the corresponding key is found, null otherwise
    return numberMapping[number] || null;
  }
}
