// Global variables - constants
const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';
const CHECKERS_BOARD_ID = 'checkers-board';

// Global variables - non-constants
let board, boardContainer, game, selectedPiece;

function _init() {
    game = new Game();
    createCheckersBoard();
}

function createCheckersBoard() {
    board = document.getElementById(CHECKERS_BOARD_ID);
    if (board !== null) { board.remove(); }



    /* Creating the table that will eventually become our game-board */
    board = document.createElement('table');
    board.id = CHECKERS_BOARD_ID;
    // boardContainer - father element of the game-board in the HTML
    boardContainer = document.getElementById('checkerboard-container');
    boardContainer.innerText = "Currently Playing: " + game.currentPlayer + " team\nScore:\nBlack: "
    + game.blackTeamScore + "\nWhite: " + game.whiteTeamScore;
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
            square.addEventListener('click', () => onSquareClick(row, col));
        }
    }
    for (let piece of game.boardData.pieces) {
        const cell = board.rows[piece.row].cells[piece.col];
        addImage(cell, piece.player);
    }
}

function onSquareClick(row, col) {
    // first case click-scenario (first click/non-move)
    if (selectedPiece === undefined) {
        game.showMoves(row, col);
    } else {
        if (game.tryMove(selectedPiece, row, col)) {
            selectedPiece = undefined; // true - we can move the piece to [row,col], and we did
            createCheckersBoard();
        } else { // false - we can't move the piece, so we'll just show the selected cell's possibleMoves
            game.showMoves(row, col);
        }
    }
}



function addImage(cell, player) {
    const image = document.createElement('img');
    image.src = "images/" + player + "/pawn.png"
    cell.appendChild(image);
}







// After the HTML is loaded, createCheckerboard() is called
window.addEventListener('load', _init);