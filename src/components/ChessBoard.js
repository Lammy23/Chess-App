import React from "react";
import ChessTile from "../components/ChessTile";

function ChessBoard() {

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const board = [];
    ranks.reverse().forEach((rank) => files.forEach((file) => board.push(file + rank)))

  return (
    <div id="chessboard">
      {
        //Initial Position of the Board
        board.map((position) => {
          let image;
          if (position[1] === '2') { // Rendering White Pawns
            image = <img id="white pawn" alt="white pawn" src="assets/images/pawn_w.png"/>;
          } else if (position[1] === '7') { // Rendering Black Pawns
            image = <img id="black pawn" alt="black pawn" src="assets/images/pawn_b.png"/>;
          } else if (position[1] === '1') { //Rendering Rest of the White pieces
            if(position[0] === 'a' || position[0] === 'h') {
              image = <img id="White Rook" alt="White Rook" src="assets/images/rook_w.png"/>;
            } else if (position[0] === 'b' || position[0] === 'g') {
              image = <img id="White Knight" alt="White Knight" src="assets/images/knight_w.png"/>;
            } else if (position[0] === 'c' || position[0] === 'f') {
              image = <img id="White Bishop" alt="White Bishop" src="assets/images/bishop_w.png"/>;
            } else if (position[0] === 'd') {
              image = <img id="White Queen" alt="White Queen" src="assets/images/queen_w.png"/>;
            } else if (position[0] === 'e') {
              image = <img id="White King" alt="White King" src="assets/images/king_w.png"/>;
            }
          } else if (position[1] === '8') { //Rendering Rest of the Black pieces
            if(position[0] === 'a' || position[0] === 'h') {
              image = <img id="Black Rook" alt="Black Rook" src="assets/images/rook_b.png"/>;
            } else if (position[0] === 'b' || position[0] === 'g') {
              image = <img id="Black Knight" alt="Black Knight" src="assets/images/knight_b.png"/>;
            } else if (position[0] === 'c' || position[0] === 'f') {
              image = <img id="Black Bishop" alt="Black Bishop" src="assets/images/bishop_b.png"/>;
            } else if (position[0] === 'd') {
              image = <img id="Black Queen" alt="Black Queen" src="assets/images/queen_b.png"/>;
            } else if (position[0] === 'e') {
              image = <img id="Black King" alt="Black King" src="assets/images/king_b.png"/>;
            }
          }
          return <ChessTile position={position} image={image}/>;
      })}
    </div>
  );
}

export default ChessBoard;
