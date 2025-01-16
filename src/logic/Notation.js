import { ChessCoordinate } from "./Coordinates";
import { ChessPiece } from "./Piece";
import { Knight } from "./pieces/Knight";
import { Pawn } from "./pieces/Pawn";
import { Color } from "../components/constants";
import { Bishop } from "./pieces/Bishop";
import { bishopMove } from "./rules/bishopRules";
import { Rook } from "./pieces/Rook";
import { Queen } from "./pieces/Queen";
import { King } from "./pieces/King";

export class PieceNotation {
	// Fields

	piece; // String
	from; // ChessCoordinates
	to; // ChessCoordinates

	// Notation parts (private)
	#piecePart = "";
	#filePart = "";
	#takesPart = "";
	#coordinatePart = "";
	#checkPart = "";
	#checkmatePart = "";
	#pawnPromotionPart = ""; // For Pawn promotions
	fullNotation = "";

	// Castles
	#isCastleQueenSide;
	#isCastleKingSide;

	// Booleans
	#isCapture;
	#isCheck;
	#isCheckmate;
	#isPromotion;

	// Piece map
	pieceMap = {
		// TODO: add more
		pawn: "",
		knight: "N",
		bishop: "B",
		rook: "R",
		queen: "Q",
		king: "K",
	};

	/**
	 * Constructor
	 * @param {string} piece
	 * @param {ChessCoordinate} from
	 * @param {ChessCoordinate} to
	 */
	constructor(piece, from, to, isCapture, isCheck, isCheckmate, isCastleKingSide, isCastleQueenSide) {
		this.piece = piece;
		this.from = from;
		this.to = to;
		this.#isCapture = isCapture;
    this.#isCastleQueenSide = isCastleQueenSide;
    this.#isCastleKingSide =isCastleKingSide
		this.#isCheck = isCheck;
		this.#isCheckmate = isCheckmate;

    // DEBUG
    // console.log(
    //   'piece', piece, '\n',
    //   'from', from, '\n',
    //   'to', to, '\n',
    // );
    
	}

	// TODO: fix lastmove was capture
	// Private Methods
	#specialPawnNotation() {
		// PAWN
		if (this.from.minus(this.to).fileStep === 1) {
			// If on different files
			this.#filePart = this.from.coordinate[0];
			this.#takesPart = "x";
		}
	}

	#getPossibleMoves(boardState, currentTurn) {
		if (this.piece === ChessPiece.knight) {
			return new Knight(currentTurn).getPossibleMovesFrom(
				[this.to],
				boardState
			);
		}
		if (this.piece === ChessPiece.pawn) {
			return new Pawn(currentTurn).getPossibleCapturesFrom(
				[this.to],
				boardState
			);
		}

		if (this.piece === ChessPiece.bishop) {
			return new Bishop(currentTurn).getPossibleMovesFrom(
				[this.to],
				boardState
			);
		}

		if (this.piece === ChessPiece.rook) {
			return new Rook(currentTurn).getPossibleMovesFrom([this.to], boardState);
		}

		if (this.piece === ChessPiece.queen) {
			return new Queen(currentTurn).getPossibleMovesFrom([this.to], boardState);
		}

		if (this.piece === ChessPiece.king) {
			return new King(currentTurn).getPossibleMovesFrom([this.to], boardState);
		}
	}

	calculateNotation(boardState, currentTurn) {

    // DEBUG
    // console.log(
    //   'castleKingSide', this.#isCastleKingSide,
    // )
    

    // Checking if castle king side
    if (this.#isCastleKingSide)
    {
      return 'O-O'
    }

    // Checking if castle queen side
    if (this.#isCastleQueenSide)
    {
      return 'O-O-O'
    }


		this.#takesPart = this.#isCapture ? "x" : "";
		if (this.#isCheck) {
			if (this.#isCheckmate) {
				this.#checkmatePart = "#";
			} else {
				this.#checkPart = "+";
			}
		}

		this.#coordinatePart = this.to.coordinate;
		this.#piecePart = this.pieceMap[this.piece];
		if (this.piece === ChessPiece.pawn) {
			this.#specialPawnNotation();
			// console.log("Pawn move:", this.from.coordinate, "->", this.to.coordinate); // # DEBUG
			const promotionRank = currentTurn === Color.white ? 1 : 8; // is the coordinates flipped / coordinates begin from top left of the board??
			// console.log("Target rank:", this.to.rank, "Expected:", promotionRank); // # DEBUG

			// Check for promotion
			// # TODO: NEED TO INCLUDE CHECK NOTATION AFTER PROMOTION (cxd8=Q+) or (cxd8=Q#)
			if (this.to.rank === promotionRank) {
				// Assuming a default promotion to Queen
				this.#pawnPromotionPart = "=Q"; // #TODO: Adjust this to allow for user choice to Promote
				// console.log("Pawn promotion detected:", this.#pawnPromotionPart); // # DEBUG
			}
		}
		const moves = this.#getPossibleMoves(boardState, currentTurn);

		// checking if knight is in coordinates with boardstate
		var pieceCounter = 0;
		moves.forEach((move) => {
			if (
				ChessPiece.getPiece(boardState[move]) === this.piece &&
				ChessPiece.getColor(boardState[move]) === Color.toggleColor(currentTurn)
			) {
				pieceCounter++;
			}
		});
		if (
			pieceCounter >= 2 &&
			!(
				this.piece === ChessPiece.pawn && this.to.minus(this.from).fileStep >= 1
			)
		) {
			console.log("Im special"); // # DEBUG
			this.#filePart = this.from.coordinate[0];
		}

		// Constructing Full Notation
		this.fullNotation =
			this.#piecePart +
			this.#filePart +
			this.#takesPart +
			this.#coordinatePart +
			this.#pawnPromotionPart +
			this.#checkPart +
			this.#checkmatePart;

		return this.fullNotation;
	}
}
