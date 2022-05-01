// Global variables - constants
const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';
const CHECKERS_BOARD_ID = 'checkers-board';

// Global variables - non-constants
let board, boardContainer;

    

function _init() {
    let boardData = new BoardData();
    
    /* Creating the table that will eventually become our game-board */
    board = document.createElement('table');
    board.id = CHECKERS_BOARD_ID;
    // boardContainer - father element of the game-board in the HTML
    boardContainer = document.getElementById('checkerboard-container');
    boardContainer.appendChild(board);

    /* Creating a table - size 8X8 */
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowElement = board.insertRow();
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = rowElement.insertCell();
            if ((row + col) % 2 === 0) {
                square.className = 'light-cell';
                
            } else {
                square.className = 'dark-cell';
            }
            // square.innerText = "cell";
        }
    }
    for (let piece in boardData.pieces) {
        const cell = board.rows[piece.row].cells[piece.col];
        addImage(cell, piece.player);
    }
    
}

function addImage(cell, player) {
    const image = document.createElement('img');
    image.src = "images/" + player + "/pawn.png"
}







// After the HTML is loaded, createCheckerboard() is called
window.addEventListener('load', _init);