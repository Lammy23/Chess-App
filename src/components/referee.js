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

        //Logic for pawn movement
        if(pieceType === 'pawn_w' || pieceType === 'pawn_b') {
            // Determining if the pawn moved is the first move made
            const isFirstMove = (pieceType === 'pawn_w' && previousRank === 2) || (pieceType === 'pawn_b' && previousRank === 7);
            if (isFirstMove) {
                // LOL HARD CODED LOGIC FOR NOT ALLOWING PIECE TO CAPTURE ITS OWN PIECE HAHA
                if ((currentRank - previousRank) <= 2 && (currentRank - previousRank) > 0 && previousFile === currentFile) {
                    // Implement logic for first move of pawn (moving 1 or 2 squares vertically)
                    console.log("FIRST MOVE");
                    return true;
                }
            } else {
                if ((currentRank - previousRank) === 1 && previousFile === currentFile) {
                    // Implement logic for normal move of pawn (moving 1 square vertically)
                    console.log("NOT FIRST MOVE");
                    return true;
                }
            }

        }
        return false;        
    }

    extractRank(coordinate) {
        const match = coordinate.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    }

    extractFile(coordinate) {
        const match = coordinate.match(/[a-h]/);
        return match ? match[0] : null;
    }
}
    
