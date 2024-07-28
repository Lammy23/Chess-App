// import React, { useRef } from "react";
// import { PieceType } from "../context/MovementContext";

export default class referee {
    isValidMove(previousCoordinates, currentCoordinates, pieceType) {
        //DEBUG
        //Logging the coordinates and piece types
        // console.log("Previous Location: ", {previousCoordinates});
        // console.log("Current Location: ", {currentCoordinates});
        // console.log("Piece Type: ", {pieceType});
        
        //#TODO: Might be a better way to extract from hashmap? 
        const previousFile = this.extractFile(previousCoordinates);
        const previousRank = this.extractRank(previousCoordinates);
        const currentFile = this.extractFile(currentCoordinates);
        const currentRank = this.extractRank(currentCoordinates);
        const previousFileNumber = this.fileToNumber(previousFile);
        const currentFileNumber = this.fileToNumber(currentFile);

        //Logic for white pawn movement (does not include attacking)
        //#TODO: Nothing works for black pawns currently
        if(pieceType === 'pawn_w' || pieceType === 'pawn_b') {
            // Determining if the pawn moved is the first move made
            const isFirstMove = (pieceType === 'pawn_w' && previousRank === 2) || (pieceType === 'pawn_b' && previousRank === 7);
            if (isFirstMove) {
                // LOL HARD CODED LOGIC FOR NOT ALLOWING PIECE TO CAPTURE ITS OWN PIECE HAHA
                if ((currentRank - previousRank) <= 2 && (currentRank - previousRank) > 0 && previousFile === currentFile) {
                    // Implement logic for first move of pawn (moving 1 or 2 squares vertically)
                    return true;
                }
            } else {
                if ((currentRank - previousRank) === 1 && previousFile === currentFile) {
                    // Implement logic for normal move of pawn (moving 1 square vertically)
                    return true;
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
        const match = coordinate.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    }

    //Extracting the File from the coordinate given
    extractFile(coordinate) {
        const match = coordinate.match(/[a-h]/);
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
        return fileMapping[file] || null;
    }
}
    
