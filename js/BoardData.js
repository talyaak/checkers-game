class BoardData {
    constructor() {
        this.getInitialPieces();
    }
    getInitialPieces() {
        this.pieces = [];
        // pieces in uneven rows:
        for (let i = 1; i < BOARD_SIZE; i + 2) {
            this.pieces.push(new Piece(0, i, WHITE_PLAYER));
            this.pieces.push(new Piece(2, i, WHITE_PLAYER));
            this.pieces.push(new Piece(6, i, BLACK_PLAYER));
        }
        // pieces in even rows:
        for (i = 0; i < BOARD_SIZE; i + 2) {
            this.pieces.push(new Piece(1, i, WHITE_PLAYER));
            this.pieces.push(new Piece(5, i, BLACK_PLAYER));
            this.pieces.push(new Piece(7, i, BLACK_PLAYER));
        }
    }
    getPiece(row, col) {
        for (let piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece;
            }
        }
    }
    isEmpty(row, col) {
        return this.getPiece(row, col) === undefined;
    }
}