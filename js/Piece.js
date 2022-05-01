class Piece {
    constructor(row, col, player) {
        this.player = player;
        this.row = row;
        this.col = col;
        this.king = false;
    }
    getOpponent() {
        if (this.player == WHITE_PLAYER) { return BLACK_PLAYER; }
        else { return WHITE_PLAYER; }
    }
}