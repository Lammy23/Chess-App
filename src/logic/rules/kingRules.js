import { allChessCoordinates, Color } from "../../components/constants";
import { ChessCoordinate } from "../Coordinates";

/*
  const castleParameters = {
    leftWhiteRookMoved: leftWhiteRookMoved,
    rightWhiteRookMoved: rightWhiteRookMoved,
    leftBlackRookMoved: leftBlackRookMoved,
    rightBlackRookMoved: rightBlackRookMoved,
    whiteKingMoved: whiteKingMoved,
    blackKingMoved: blackKingMoved,
  }
*/

export function kingMove({
	previousRank,
	currentRank,
	previousFile,
	currentFile,
	previousFileNumber,
	currentFileNumber,
	boardState,
	teamColour,
	castleParameters,
}) {
	/* Diagonal Movement */
	if (
		Math.abs(currentFileNumber - previousFileNumber) === 1 &&
		Math.abs(currentRank - previousRank) === 1
	) {
		/* Vertical Movement */
	} else if (
		Math.abs(currentRank - previousRank) === 1 &&
		previousFile === currentFile
	) {
		/* Horizontal Movement */
	} else if (
		Math.abs(currentFileNumber - previousFileNumber) === 1 &&
		previousRank === currentRank
	) {
	} else if (
		Math.abs(currentFileNumber - previousFileNumber) === 2 &&
		currentRank === previousRank
	) {
		if (this.isValidCastling()) {
			/* BLAH BLAH CHANGE ROOK AND KING SINCE IT IS VALID */
			/* Set castling to true or something */

			return true
      // Experiment start
      // return {status: true, castleOccured: this.isValidCastling()}
      // Experiment end
		} else {
			return false;
		}
		// return this.isValidCastling()
	} else {
		return false;
	}

	/* If it is occupied, then it must be either the same or opposing colour */
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

export function possibleKingMoves({ futureBoardState, teamColour }) {
	var color = Color.getLetter(teamColour);

	// 1. Get king coordinates
	var kingCoordinates = [];

	for (let coordinate of allChessCoordinates) {
		if (futureBoardState[coordinate] === `king_${color}`) {
			kingCoordinates.push(new ChessCoordinate(coordinate));
		}
	}

	// 2. Calculate king moves

	const moveList = [];
	const moveMap = [];

	/**
	 *
	 * @param {ChessCoordinate} coordinate
	 */
	const check = (coordinate) => {
		let origin = coordinate.coordinate;

		const x = [-1, 0, 1]; // File
		const y = [1, 0, -1]; // Rank

		for (let file of x) {
			for (let rank of y) {
				if (
					coordinate.plus({ fileStep: file, rankStep: rank }).coordinate !==
					origin
				) {
					if (
						!coordinate.isOccupied(futureBoardState) ||
						coordinate.isOccupiedByOpponent(futureBoardState, teamColour)
					) {
						moveList.push(coordinate.coordinate);
						moveMap.push({
							from: origin,
							to: coordinate.coordinate,
						});
					}
				}
				coordinate.setCoordinate(origin);
			}
		}
	};

	for (let coordinate of kingCoordinates) {
		check(coordinate);
	}

	return { moveList: moveList, moveMap: moveMap };
}

export function validCastling({
	previousFileNumber,
	currentFileNumber,
	previousRank,
	currentRank,
	boardState,
	teamColour,
	moveHistory,
	castleParameters,
}) {
	
	// Readablility
	const RIGHTSIDECASTLE = "right";
	const LEFTSIDECASTLE = "left";
	// Finding out whether player is trying to do a long castle or a short castle (FROM WHITES POV)
	const castleDirection =
		currentFileNumber - previousFileNumber === 2
			? RIGHTSIDECASTLE
			: LEFTSIDECASTLE;
	// To fix the mismatch of un-capitalized letters in the words 'white' and 'black'
	const cappedColor = teamColour;
	const uncappedColor = teamColour === Color.White ? "white" : "black";

	// When king has moved, castling is no longer available here
	if (castleParameters[`${uncappedColor}KingMoved`] === true) {
		return false;
	}
	// If the king is trying to castle in that direction, and the rook in the corresponding direction has moved
	// it will not allow castling
	if (castleParameters[`${castleDirection}${cappedColor}RookMoved`] === true) {
		return false;
	}
	// Castling LOGIC!
	// 1. Check the pieces are not blocking kings and rooks way 										DONE
	// 2. Check that king is not check 																	INCOMPLETE
	// ignore below now
	// 3. Check that king will not move into check as it is trying castling (Does not matter for rook)	INCOMPLETE
	// 3.1 Check that the king will not be in check after it castled									INCOMPLETE

	// TODO: The below is wrong and needs fixing
	// Shouldn't directly modify the hashmap


	// Setting the appropriate Castling variables

	var currentRookCoordinates = ''
	var oldRookCoordinates = ''

	if (castleDirection === "left") {
		if (
			cappedColor === "White" &&
			boardState["b1"] === null &&
			boardState["c1"] === null &&
			boardState["d1"] === null
		) {
			currentRookCoordinates = 'd1'
			oldRookCoordinates = 'a1'
			// boardState["d1"] = boardState["a1"];
			// boardState["a1"] = null;
		} else if (
			cappedColor === "Black" &&
			boardState["b8"] === null &&
			boardState["c8"] === null &&
			boardState["d8"] === null
		) {
			currentRookCoordinates = 'd8'
			oldRookCoordinates = 'a8'
			// boardState["d8"] = boardState["a8"];
			// boardState["a8"] = null;
		}

		this.isCastleQueenSide = true

	} else if (castleDirection === "right") {
		if (
			cappedColor === "White" &&
			boardState["f1"] === null &&
			boardState["g1"] === null
		) {
			currentRookCoordinates = 'f1'
			oldRookCoordinates = 'h1'
			// boardState["f1"] = boardState["h1"];
			// boardState["h1"] = null;
		} else if (
			cappedColor === "Black" &&
			boardState["f8"] === null &&
			boardState["g8"] === null
		) {
			currentRookCoordinates = 'f8'
			oldRookCoordinates = 'h8'
			// boardState["f8"] = boardState["h8"];
			// boardState["h8"] = null;
		}

		this.isCastleKingSide = true

	}

	this.castleMoveDetails = {
		oldRookCoordinates: oldRookCoordinates,
		currentRookCoordinates: currentRookCoordinates
	}

	this.isCastle = true;

	return true
}

export function test(testSubject)
{
	console.log("Testing");
	
	console.log(testSubject);
	
}
