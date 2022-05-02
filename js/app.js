// Global variables - constants
const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';
const CHECKERS_BOARD_ID = 'checkers-board';

// Global variables - non-constants
let board, boardContainer, game, selectedPiece, winnerAnnounce = "", winner;
let authorizedPieces = []; // <- An array that holds pieces which are allowed to move

// Runs after HTML Load
function _init() {
    game = new Game();
    createCheckersBoard();
}

// Creates the Checkers board, runs after _init(), runs after every time BoardData is updated
function createCheckersBoard() {

    /* Two functions in Game() that run in the background, after every piece movement
    checkForWinner is self-explanatory, checkForShowdown helps us decide which pieces
    are allowed to move at every turn*/
    game.checkForWinner();
    game.checkForShowdown();

    // Creating/recreating the board (createCheckersBoard runs anew with every 'click')
    board = document.getElementById(CHECKERS_BOARD_ID);
    if (board !== null) {
        board.remove();
    }



    /* Creating the table that will eventually become our game-board */
    board = document.createElement('table');
    board.id = CHECKERS_BOARD_ID;

    // boardContainer - father element of the game-board in the HTML
    boardContainer = document.getElementById('checkerboard-container');
    boardContainer.innerText = "Currently Playing: " + game.currentPlayer + " team\nScore:\nBlack: "
        + game.blackTeamScore + "\nWhite: " + game.whiteTeamScore + "\n";
    boardContainer.appendChild(board);

    /* Creating a table - size 8X8 */
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowElement = board.insertRow();
        for (let col = 0; col < BOARD_SIZE; col++) {
            const square = rowElement.insertCell();
            if ((row + col) % 2 === 0) {
                square.className = 'light-cell';

            } else { square.className = 'dark-cell'; }
            square.addEventListener('click', () => onSquareClick(row, col));
        }
    }
    // Adding images to every square that holds a checkers piece
    for (let piece of game.boardData.pieces) {
        const square = board.rows[piece.row].cells[piece.col];
        if (authorizedPieces.includes(piece) && game.currentPlayer === piece.player) {
            addImage(square, piece.player, true);
        }
        else { addImage(square, piece.player, false); }

    }

    // A Popup message that will appear when a winner is declared
    let winnerMsg = document.createElement('div')
    if (winnerAnnounce !== "") {
        winnerMsg.textContent = winnerAnnounce;
        board.appendChild(winnerMsg);
        winnerMsg.classList.add('winner-msg');
        for (let element of document.body.getElementsByTagName("img")) {
            element.classList.remove("piece"); // remove css cursor pointer
        }
    }
}

// Runs after each time a table square is clicked
function onSquareClick(row, col) {

    /* Creating boolean statements that will help us determine how the
    function will work depending on the board and pieces */
    let authCheck;
    if (game.boardData.isPlayer(row, col, game.currentPlayer)) {
        const tempPiece = game.boardData.getPiece(row, col);

        // authCheck - boolean expression (true - tempPiece is authorized to move)
        authCheck = authorizedPieces.includes(tempPiece);
    }

    // emptyCell - boolean expression (true - square[row,col] is empty)
    const emptyCell = game.boardData.isEmpty(row, col);

    // first case click-scenario (first click/non-move)
    // if statement to prevent onSquareClick for unauthorized player
    if (selectedPiece === undefined && (authCheck || emptyCell)) {
        console.log("test 1");
        game.showMoves(row, col);

        // Not a first-click scenario, It's a try-to-move scenario
    } else if (selectedPiece !== undefined && (authCheck || emptyCell)) {
        if (game.tryMove(selectedPiece, row, col)) {
            console.log("test 2");
            selectedPiece = undefined; // true - we can move the piece to [row,col], and we did
            createCheckersBoard(); // Revamping the Checkers board since a change has been made

        } else { // false - we can't move the piece, so we'll just show the selected cell's possibleMoves
            console.log("test 3");
            game.showMoves(row, col);
        }
    } else { console.log("not your turn/empty cell"); }
}


// Adds an image according to parameters
function addImage(cell, player, glow) {
    const image = document.createElement('img');
    image.classList.add("piece"); // Css class, cursor pointer
    image.src = "images/" + player + "/pawn.png"

    // glow - boolean expression: True - currentPlayer's pieces (they will glow in-game for)
    if (glow) { image.classList.add('glow'); }
    cell.appendChild(image);
}

// function authorizedGlow() {
//     for (piece of authorizedPieces) {
//         if (piece.player === game.currentPlayer) {
//             board.rows[piece.row].cells[piece.col].classList.add('glow');
//         }
//     }
// }
// function removeGlow() {
//     for (let i = 0; i < BOARD_SIZE; i++) {
//         for (let j = 0; j < BOARD_SIZE; j++) {
//             board.rows[i].cells[j].classList.remove('glow');
//         }
//     }
// }


// After the HTML is loaded, createCheckerboard() is called
window.addEventListener('load', _init);
