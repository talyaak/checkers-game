// BoardData - our local JS database

class BoardData {
    /* The constructor creates the board pieces
    We can use board data to access pieces & info */
    constructor() {
        this.getInitialPieces();

    }

    // list of 32 pieces
    getInitialPieces() {
        this.pieces = [];
        // pieces in uneven rows:
        for (let i = 1; i < BOARD_SIZE; i = i + 2) {
            this.pieces.push(new Piece(0, i, WHITE_PLAYER));
            this.pieces.push(new Piece(2, i, WHITE_PLAYER));
            this.pieces.push(new Piece(6, i, BLACK_PLAYER));
        }
        // pieces in even rows:
        for (let i = 0; i < BOARD_SIZE; i = i + 2) {
            this.pieces.push(new Piece(1, i, WHITE_PLAYER));
            this.pieces.push(new Piece(5, i, BLACK_PLAYER));
            this.pieces.push(new Piece(7, i, BLACK_PLAYER));
        }
    }
    // Returns piece in row, col, or undefined if not exists.
    getPiece(row, col) {
        for (let piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece;
            }
        }
    }

    /* Checks if given parameters appoint to undefined
    cell (no piece in cell) */
    isEmpty(row, col) {
        return this.getPiece(row, col) === undefined;
    }

    /* Checks if there is a player(given parameter) in [row,col](also given parameter) */
    isPlayer(row, col, player) {
        return !this.isEmpty(row, col) && this.getPiece(row, col).player === player;
    }
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                // Remove piece at index i
                this.pieces.splice(i, 1);
            }
        }
    }
}