import { bishopMove } from "./rules/bishopRules";
import { kingMove } from "./rules/kingRules";
import { knightMove } from "./rules/knightRules";
import { pawnMove } from "./rules/pawnRules";
import { queenMove } from "./rules/queenRules";
import { rookMove } from "./rules/rookRules";

export default class Referee {
  // Fields
  #refContext = {};

  // Methods
  updateRefereeContext = (
    previousCoordinates,
    currentCoordinates,
    boardState,
    pieceType
  ) => {
    //#SUGGESTION: Might be a better way to extract from hashmap?
    this.#refContext = {
      previousFile: this.extractFile(previousCoordinates),
      previousRank: this.extractRank(previousCoordinates),
      currentFile: this.extractFile(currentCoordinates),
      currentRank: this.extractRank(currentCoordinates),
      teamColour: this.extractTeamColour(pieceType),
      boardState: boardState,
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
    // console.log("Previous Location: ", { previousCoordinates });
    // console.log("Current Location: ", { currentCoordinates });
    // console.log("Piece Type: ", { pieceType });

    /*  
    Three layers:
    1. Is a valid normal move
    2. Are we in check? If so does this move get us out of check
    3. Are we checkmated?
    */

    if (pieceType === "pawn_w" || pieceType === "pawn_b") {
      // Checking pawn move
      console.log("Hello")
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
    return false;
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
  validEnPassant(tileX, tileY, boardState, TeamType) {
    const tileKey = `${tileX}${tileY}`;
    const attackableOpposingPawn = TeamType === "WHITE" ? "pawn_b" : "pawn_w";
    if (boardState[tileKey] === attackableOpposingPawn) {
      return true;
    }
    return false;
  }

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
