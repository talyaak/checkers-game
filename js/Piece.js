/* 'Piece' - stores chess piece info, functions include getOpponent, getPossibleMoves, filterMoves*/
class Piece {
    constructor(row, col, player) {
        this.row = row;
        this.col = col;
        this.player = player;
        this.doubleManeuvering = false; // <- if a piece is currently mid-jump-sequence
        this.queenStatus = false;
    }

    // Get the opponent's player type
    getOpponent() {
        if (this.player === WHITE_PLAYER) { return BLACK_PLAYER; }
        else { return WHITE_PLAYER; }
    }

    // Get moves of this piece inside given BoardData
    getPossibleMoves(boardData, isDoubleManeuvering) { // 2nd param is boolean, optional for jumping pieces
        let absoluteMoves = [], relativeMoves, relativeMove, enemyMoves = [];
        //possible relative moves - standalone

    

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
        // a relative moves looks like this: [row, col]
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

        // filtering out out-of-bound moves
        enemyMoves = this.filterMoves(enemyMoves);
        absoluteMoves = this.filterMoves(absoluteMoves);

        // If there are any enemy moves - we ignore absolute moves (abiding game rules).
        if (enemyMoves.length !== 0) { return enemyMoves; }

        return absoluteMoves;
    }

    // Inner function that helps filtering out out-of-bounds moves
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