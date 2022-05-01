class Game {
    constructor() {
        this.boardData = new BoardData();
        this.currentPlayer = BLACK_PLAYER; // Black always starts first in Checkers
        this.whiteTeamScore = 0;
        this.blackTeamScore = 0;
    }
    showMoves(row, col) {
        // Clear all previous possible moves, selected and enemy
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                board.rows[i].cells[j].classList.remove('possible-move');
                board.rows[i].cells[j].classList.remove('selected');
                board.rows[i].cells[j].classList.remove('enemy');
            }
        }

        // Using boardData to gain information
        const piece = this.boardData.getPiece(row, col);
        // Acquiring possible moves and giving them a color
        if (piece !== undefined) {
            let possibleMoves = piece.getPossibleMoves(this.boardData);
            for (let possibleMove of possibleMoves) {
                const cell = board.rows[possibleMove[0]].cells[possibleMove[1]];
                // // Giving a 'eatable' enemy a color - irrelevant
                // if (this.boardData.isPlayer((possibleMove[0]-1), (possibleMove[1]-1), piece.getOpponent())) {
                //     const enemyCell = board.rows[possibleMove[0]-1].cells[possibleMove[1]-1];
                //     enemyCell.classList.add('enemy');
                // }
                // Giving cells in our path a color
                cell.classList.add('possible-move');
            }
        }

        // Giving the selected piece's cell a color
        board.rows[row].cells[col].classList.add('selected');
        selectedPiece = piece;
    }
    tryMove(selectedPiece, row, col) {
        const possibleMoves = this.getPossibleMoves(selectedPiece);
        for (const possibleMove of possibleMoves) { // possibleMove example: [1,1], [-1,1]
            // 'if' block that checks if there is a legal move (within possibleMoves array)
            if (possibleMove[0] === row && possibleMove[1] === col) {
                this.eatPotentialEnemy(selectedPiece, row, col, possibleMove);
                selectedPiece.row = row;
                selectedPiece.col = col;
                this.currentPlayer = selectedPiece.getOpponent();
                return true
            }
        }
        return false;
    }
    // Checking after each move, if an enemy has been eaten
    eatPotentialEnemy(selectedPiece, row, col) {
        // if block - checks if player has moved more than one cube away (== ate an enemy)
        if (Math.abs(row - selectedPiece.row) > 1 && Math.abs(col - selectedPiece.col) > 1) {
            let relativeMove = [0, 0];
            relativeMove[0] = row - selectedPiece.row;
            relativeMove[1] = col - selectedPiece.col;
            const enemyRow = selectedPiece.row + relativeMove[0] / 2;
            const enemyCol = selectedPiece.col + relativeMove[1] / 2;
            // Asserting that there is an enemy, removing enemy from boardData, acquiring score
            if (this.boardData.isPlayer(enemyRow, enemyCol, selectedPiece.getOpponent())) {
                this.boardData.removePiece(enemyRow, enemyCol)
                if (selectedPiece.player === WHITE_PLAYER) { this.whiteTeamScore++; }
                else { this.blackTeamScore++; }
            }
        }
    }



    getPossibleMoves(piece) {
        if (this.currentPlayer !== piece.player) { return [] } // No moves, wait for your turn
        return piece.getPossibleMoves(this.boardData);
    }
}