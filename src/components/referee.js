// import React, { useRef } from "react";
// import { PieceType } from "../context/MovementContext";

export default class referee {
    tileIsOccupied(tileX, tileY, boardState) {
        const tileKey = `${tileX}${tileY}`;
        return boardState[tileKey] !== undefined && boardState[tileKey] !== null;
    }

    isValidMove(previousCoordinates, currentCoordinates, pieceType, boardState) {
        //DEBUG
        //Logging the coordinates and piece types
        console.log("Previous Location: ", {previousCoordinates});
        console.log("Current Location: ", {currentCoordinates});
        // console.log("Piece Type: ", {pieceType});
        
        //#TODO: Might be a better way to extract from hashmap? 
        const previousFile = this.extractFile(previousCoordinates);
        const previousRank = this.extractRank(previousCoordinates);
        const currentFile = this.extractFile(currentCoordinates);
        const currentRank = this.extractRank(currentCoordinates);
        const previousFileNumber = this.fileToNumber(previousFile);
        const currentFileNumber = this.fileToNumber(currentFile);

        // #TODO: Condense the below code by using a conditional instead of repeating the code for both black and white 
        // if(pieceType === 'pawn_w') {
        //     const specialRank = 2;
        // } else if (pieceType === 'pawn_b') {

        // }

        //Logic for White pawn movement (does not include attacking)
        if(pieceType === 'pawn_w') {
            // First move for pawn and they are moving 2 squares up
            if (previousRank === 2 && (currentRank - previousRank) === 2  && previousFile === currentFile) {
                // Ensures that if there is a piece blocking the way of the pawn to its destination, it will not allow it
                if(!this.tileIsOccupied(currentFile, currentRank - 1, boardState) && !this.tileIsOccupied(currentFile, currentRank, boardState)) {
                    // -1 since it needs to check if there is anything one tile behind it and also if anything is on the tile it wants to go to
                    return true;
                }   
            } else {
                // Can treat the move as isNotAFirstMove if the pawn decides it wants to go 1 tile instead of 2 on its first move
                if ((currentRank - previousRank) === 1 && previousFile === currentFile) {
                    if(!this.tileIsOccupied(currentFile, currentRank, boardState)) {
                        return true;
                    }
                }
            }
        // Separate logic for black pawns. The logic is the same, but all calculations are done in reverse with respect to black's perspective
        } else if (pieceType === 'pawn_b') {
            if (previousRank === 7 && (previousRank - currentRank) === 2  && previousFile === currentFile) {
                if(!this.tileIsOccupied(currentFile, currentRank + 1, boardState) && !this.tileIsOccupied(currentFile, currentRank, boardState)) {
                    return true;
                }
            } else {
                if ((previousRank - currentRank) === 1 && previousFile === currentFile) {
                    if(!this.tileIsOccupied(currentFile, currentRank, boardState)) {
                        return true;
                    }
                }
            }
        }
        //#TODO: Pieces do not care about whether or not there is a piece in front of it
        //Logic for King movement
        if(pieceType === 'king_w' || pieceType === 'king_b') {
            // Diagonal Movement
            if(Math.abs(currentFileNumber - previousFileNumber) === 1 && Math.abs(currentRank - previousRank) === 1) {
                return true;
            } else if (Math.abs(currentRank - previousRank) === 1 && previousFile === currentFile) { 
                // Vertical Movement
                return true;
            } else if (Math.abs(currentFileNumber - previousFileNumber) === 1 && previousRank === currentRank) {
                // Horizontal Movement
                return true;
            }
        }

        //Logic for Bishop movement (does not care if a piece is in front of it right now)
        if(pieceType === 'bishop_w' || pieceType === 'bishop_b') {
            //The difference in files MUST BE SAME as difference in ranks for a valid bishop move
            if(Math.abs(currentFileNumber - previousFileNumber) === Math.abs(currentRank - previousRank)) {
                return true;
            }
        }

        //Logic for Rook movement
        if(pieceType === 'rook_w' || pieceType === 'rook_b') {
            // Must stay in the same file or same rank for movement
            if(currentFile === previousFile) {
                return true;
            } else if (currentRank === previousRank) {
                return true;
            }
        }

        //Logic for Queen movement 
        if(pieceType === 'queen_w' || pieceType === 'queen_b') {
            // Logic is the same as a bishop and rook combined
            if(currentFile === previousFile) {
                return true;
            } else if (currentRank === previousRank) {
                return true;
            } else if (Math.abs(currentFileNumber - previousFileNumber) === Math.abs(currentRank - previousRank)) {
                return true;
            }
        }

        //Logic for Knight movement (placeholder)
        if(pieceType === 'knight_w' || pieceType === 'knight_b') {
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

    //Turning the alphabetical value to a numerical value for easy calculations
    fileToNumber(file) {
        const fileMapping = {
            'a': 1,
            'b': 2,
            'c': 3,
            'd': 4,
            'e': 5,
            'f': 6,
            'g': 7,
            'h': 8
        };
        //Returns value if the corresponding key is found, null otherwise
        return fileMapping[file] || null;
    }
}
    
