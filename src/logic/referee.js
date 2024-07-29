import { isPawnMove } from "./rules/pawnRules";

export default class referee {
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

  //#SUGGESTION: Change all if statements to else ifs

  /**
   * Determines if a move is valid based on the coordinates, piece type and the board state
   * @param {string} previousCoordinates
   * @param {string} currentCoordinates
   * @param {string} pieceType
   * @param {object} boardState
   * @returns {boolean} true if the move is valid, false otherwise
   */
  isValidMove(previousCoordinates, currentCoordinates, pieceType, boardState) {
    // #DEBUGGING
    // Logging the coordinates and piece types
    // console.log("Previous Location: ", { previousCoordinates });
    // console.log("Current Location: ", { currentCoordinates });
    // console.log("Piece Type: ", { pieceType });

    //#SUGGESTION: Might be a better way to extract from hashmap?
    const previousFile = this.extractFile(previousCoordinates);
    const previousRank = this.extractRank(previousCoordinates);
    const currentFile = this.extractFile(currentCoordinates);
    const currentRank = this.extractRank(currentCoordinates);
    const previousFileNumber = this.fileToNumber(previousFile);
    const currentFileNumber = this.fileToNumber(currentFile);

    // Team colour can only be black or white
    const teamColour = this.extractTeamColour(pieceType);
 

    /*  
    Three layers:
    1. Is a valid normal move
    2. Are we in check? If so does this move get us out of check
    3. Are we checkmated?


    */
    if (pieceType === "pawn_w" || pieceType === "pawn_b") {
      isPawnMove()
    }


    //#TODO: Pieces do not care about whether or not there is a piece in front of it
    //Logic for King movement
    if (pieceType === "king_w" || pieceType === "king_b") {
      // Diagonal Movement
      if (
        Math.abs(currentFileNumber - previousFileNumber) === 1 &&
        Math.abs(currentRank - previousRank) === 1
      ) {
        return true;
      } else if (
        Math.abs(currentRank - previousRank) === 1 &&
        previousFile === currentFile
      ) {
        // Vertical Movement
        return true;
      } else if (
        Math.abs(currentFileNumber - previousFileNumber) === 1 &&
        previousRank === currentRank
      ) {
        // Horizontal Movement
        return true;
      }
    }

    //Bishop Movement Logic (some reason it can move one square up)
    if (pieceType === "bishop_w" || pieceType === "bishop_b") {
      //The difference in files MUST BE SAME as difference in ranks for a valid bishop move
      if (
        Math.abs(currentFileNumber - previousFileNumber) ===
        Math.abs(currentRank - previousRank)
      ) {
        // Forces it to compare using either the currentCoordinates or previousCoordinates depending
        // on whether it is moving up or down diagonally
        const minFile = Math.min(currentFileNumber, previousFileNumber);
        const minRank = Math.min(currentRank, previousRank);
        for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
          if (
            this.tileIsOccupied(
              this.numberToFile(minFile + i),
              minRank + i,
              boardState
            )
          ) {
            // console.log(boardState);
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      }
    }
    //SUGGESTION: Can condense this code
    //Rook Movement Logic
    if (pieceType === "rook_w" || pieceType === "rook_b") {
      // Must stay in the same file or same rank for movement
      if (currentFile === previousFile) {
        // Vertical Movement
        for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
          if (
            this.tileIsOccupied(
              currentFile,
              Math.min(currentRank, previousRank) + i,
              boardState
            )
          ) {
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      } else if (currentRank === previousRank) {
        // Horizontal Movement
        for (
          let i = 1;
          i < Math.abs(currentFileNumber - previousFileNumber);
          i++
        ) {
          if (
            this.tileIsOccupied(
              this.numberToFile(
                Math.min(currentFileNumber, previousFileNumber) + i
              ),
              currentRank,
              boardState
            )
          ) {
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      }
    }

    //Queen Movement Logic
    if (pieceType === "queen_w" || pieceType === "queen_b") {
      // Logic is the same as a bishop and rook combined
      if (currentFile === previousFile) {
        // Vertical Movement
        for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
          if (
            this.tileIsOccupied(
              currentFile,
              Math.min(currentRank, previousRank) + i,
              boardState
            )
          ) {
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      } else if (currentRank === previousRank) {
        // Horizontal Movement
        for (
          let i = 1;
          i < Math.abs(currentFileNumber - previousFileNumber);
          i++
        ) {
          if (
            this.tileIsOccupied(
              this.numberToFile(
                Math.min(currentFileNumber, previousFileNumber) + i
              ),
              currentRank,
              boardState
            )
          ) {
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      } else if (
        Math.abs(currentFileNumber - previousFileNumber) ===
        Math.abs(currentRank - previousRank)
      ) {
        // Forces it to compare using either the currentCoordinates or previousCoordinates depending
        // on whether it is moving up or down diagonally
        const minFile = Math.min(currentFileNumber, previousFileNumber);
        const minRank = Math.min(currentRank, previousRank);
        for (let i = 1; i < Math.abs(currentRank - previousRank); i++) {
          if (
            this.tileIsOccupied(
              this.numberToFile(minFile + i),
              minRank + i,
              boardState
            )
          ) {
            // console.log(boardState);
            return false;
          }
        }
        // If it is occupied, then it must be either the same or opposing colour
        if (!this.tileIsOccupied(currentFile, currentRank, boardState)) {
          return true;
        } else if (
          this.tileIsOccupiedByOpponent(
            currentFile,
            currentRank,
            boardState,
            teamColour
          )
        ) {
          return true;
        }
      }
    }

    //Logic for Knight movement (placeholder)
    if (pieceType.slice(0, 6) === "knight") {
      // Checking for 'L' shape movement.
      // #SUGGESTION: Conditions like these can condense the code
      let verticalL =
        Math.abs(currentRank - previousRank) === 2 &&
        Math.abs(currentFileNumber - previousFileNumber) === 1;
      let horizontalL =
        Math.abs(currentFileNumber - previousFileNumber) === 2 &&
        Math.abs(currentRank - previousRank) === 1;

      if (verticalL || horizontalL) {
        if (this.tileIsOccupied(currentFile, currentRank, boardState)) {
          if (
            this.tileIsOccupiedByOpponent(
              currentFile,
              currentRank,
              boardState,
              teamColour
            )
          ) {
            return true;
          }
          return false;
        }
        return true;
      }
    }
    return false;
  }

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
