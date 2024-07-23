import React, {useState} from 'react';

/**
 * This function returns a color based on the position of the tile on the board
 * @param {String} file
 * @param {String} rank 
 * @returns color
 */
function getColor(file, rank) {
    if ((file.charCodeAt(0) + parseInt(rank)) % 2 === 0) {
        return '#4e7598';
    }
        return '#ebecd0';
}

function ChessTile( {position, image} ) {
    const file = position[0];
    const rank = position[1];
    const color = getColor(file, rank)
    const [piece, setPiece] = useState(image);

    return (
        <div id='chesstile' style={{backgroundColor: color}}>
            {image}
        </div>
    )
};

export default ChessTile;