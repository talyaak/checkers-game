// Global variables - constants
const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';
const CHECKERS_BOARD_ID = 'checkers-board';

// Global variables - non-constants
let board, boardContainer, game, selectedPiece, winnerAnnounce = "", winner;

function _init() {
    game = new Game();
    createCheckersBoard();
}

function createCheckersBoard() {
    checkForWinner();

    board = document.getElementById(CHECKERS_BOARD_ID);
    if (board !== null) { board.remove(); }



    /* Creating the table that will eventually become our game-board */
    board = document.createElement('table');
    board.id = CHECKERS_BOARD_ID;
    // boardContainer - father element of the game-board in the HTML
    boardContainer = document.getElementById('checkerboard-container');
    boardContainer.innerText = "Currently Playing: " + game.currentPlayer + " team\nScore:\nBlack: "
        + game.blackTeamScore + "\nWhite: " + game.whiteTeamScore + "\n"; // + winnerAnnounce;
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

    // A Popup message that will appear when a winner is declared
    let winnerMsg = document.createElement('div')
    if (winnerAnnounce !== "") {
        winnerMsg.textContent = winnerAnnounce;
        board.appendChild(winnerMsg);
        winnerMsg.classList.add('winner-msg');
    }
}

function onSquareClick(row, col) {
    const myTurn = game.boardData.isPlayer(row, col, game.currentPlayer);
    const emptyCell = game.boardData.isEmpty(row, col);
    // first case click-scenario (first click/non-move)
    // if statement to prevent onSquareClick for unauthorized player
    if (selectedPiece === undefined && (myTurn || emptyCell)) {
        console.log("test 1");
        game.showMoves(row, col);
    } else if (selectedPiece !== undefined && (myTurn || emptyCell)) {
        if (game.tryMove(selectedPiece, row, col)) {
            console.log("test 2");
            selectedPiece = undefined; // true - we can move the piece to [row,col], and we did
            createCheckersBoard();
        } else { // false - we can't move the piece, so we'll just show the selected cell's possibleMoves
            console.log("test 3");
            game.showMoves(row, col);
        }
    } else { console.log("not your turn/empty cell"); }
}



function addImage(cell, player) {
    const image = document.createElement('img');
    image.src = "images/" + player + "/pawn.png"
    cell.appendChild(image);
}

function checkForWinner() {
    if (game.blackTeamScore === 12 || game.whiteTeamScore === 12) {
        onSquareClick = function () { } // disabling further clicks
        if (game.blackTeamScore === 12) { winner = "Black Team"; }
        else { winner = "White Team"; }
        winnerAnnounce = winner + " WON!";
    }
}






// After the HTML is loaded, createCheckerboard() is called
window.addEventListener('load', _init);