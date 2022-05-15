/**
 * * Pieces class - stores pieces info - row, column, player typ, etc.
 * * functions include: getOpponent, getPossibleMoves, filterMoves
 */

class Piece {
    constructor(row, col, player) {
        this.row = row;
        this.col = col;
        this.player = player;
        this.doubleManeuvering = false; // * <- if a piece is currently mid-jump-sequence
        this.queenStatus = false;
    }

    /**
     * Get the opponent's player type
     * @returns Player type - WHITE_PLAYER/BLACK_PLAYER
     */
    getOpponent() {
        if (this.player === WHITE_PLAYER) { return BLACK_PLAYER; }
        else { return WHITE_PLAYER; }
    }

    // TODO: define a separate queenMoves() function for code readability and functionality

    /**
     * * Get moves of this piece inside given BoardData
     * @param {boardData} boardData A boardData object
     * @param {boolean} isDoubleManeuvering Optional parameter, True if there is a "Jumper"
     * @returns List of possible moves for this piece
     */
    getPossibleMoves(boardData, isDoubleManeuvering) { // 2nd param is boolean, optional for jumping pieces
        let absoluteMoves = [], relativeMoves, relativeMove, enemyMoves = [];
        // * possible relative moves - standalone    

        if (isDoubleManeuvering) { // Jumping piece - ability to move in all directions
            relativeMoves = [[1, -1], [1, 1], [-1, -1], [-1, 1]];
        } else if (this.player === WHITE_PLAYER) {
            relativeMoves = [[1, -1], [1, 1]];
        } else {
            relativeMoves = [[-1, -1], [-1, 1]];
        }
        if (this.queenStatus) {
            relativeMoves = [];
            for (let i = 0; i < BOARD_SIZE; i++) {
                relativeMoves = relativeMoves.concat(this.getMovesInDirection(1, 1, boardData));
                relativeMoves = relativeMoves.concat(this.getMovesInDirection(-1, -1, boardData));
                relativeMoves = relativeMoves.concat(this.getMovesInDirection(1, -1, boardData));
                relativeMoves = relativeMoves.concat(this.getMovesInDirection(-1, 1, boardData));
            }
        }
        // * a relative moves looks like this: [row, col]
        for (relativeMove of relativeMoves) {
            let row = this.row + relativeMove[0]; //
            let col = this.col + relativeMove[1];
            if (boardData.isEmpty(row, col)) { // Empty scenario
                absoluteMoves.push([row, col]);
            } else if (boardData.isPlayer(row, col, this.getOpponent())) { // Enemy scenario
                
                // anotherEnemy - boolean: if(there's another enemy behind current enemy)
                const anotherEnemy = boardData.isPlayer(row + relativeMove[0], col + relativeMove[1], this.getOpponent());
                
                // anotherFriendly - boolean: if(there's a friendly behind current enemy)
                const anotherFriendly = boardData.isPlayer(row + relativeMove[0], col + relativeMove[1], this.player);
                if (!(anotherEnemy || anotherFriendly)) { // 'if' block that checks if we can eat the enemy
                    enemyMoves.push([row + relativeMove[0], col + relativeMove[1]]); // Going above encountered enemy
                } else { continue; }
            } else if (boardData.isPlayer(row, col, this.player)) { // Same-piece scenario
                continue;
            }
        }

        // * filtering out out-of-bound moves
        enemyMoves = this.filterMoves(enemyMoves);
        absoluteMoves = this.filterMoves(absoluteMoves);

        // * If there are any enemy moves - we ignore absolute moves (abiding game rules).
        if (enemyMoves.length !== 0) { return enemyMoves; }

        return absoluteMoves;
    }

    /**
     * * Inner function that helps filtering out out-of-bounds moves
     * @param {Array} moves Given moves array
     * @returns Array of filtered moves
     */
    filterMoves(moves) {
        let filteredMoves = [];
        for (let move of moves) {
            const row = move[0];
            const col = move[1];
            if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {
                filteredMoves.push(move);
            }
        }
        return filteredMoves;
    }

    // TODO: configure this function for Queen moves
    getMovesInDirection(rowDir, colDir, boardData) {
        let result = [], opponent = this.getOpponent(), player = this.player;

        for (let i = 0; i < BOARD_SIZE; i++) {
            let row = this.row + rowDir * i + 1;
            let col = this.col + colDir * i;
            if (boardData.isEmpty(row, col)) {
                result.push([row, col]);
            } else if (boardData.isPlayer(row, col, opponent)) {
                result.push([row, col]);
                return result;
            } else if (boardData.isPlayer(row, col, player)) {
                return result;
            }
        }
        return result;
    }
}