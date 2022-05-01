/* 'Piece' - stores chess piece info*/
class Piece {
    constructor(row, col, player) {
        this.row = row;
        this.col = col;
        this.player = player;
    }

    // Get the opponent's player type
    getOpponent() {
        if (this.player === WHITE_PLAYER) { return BLACK_PLAYER; }
        else { return WHITE_PLAYER; }
    }
    getPossibleMoves(boardData) {
        let absoluteMoves = [], filteredMoves = [], relativeMoves;
        //possible relative moves - standalone
        if (this.player === WHITE_PLAYER) {
            relativeMoves = [[1, -1], [1, 1]];
        } else {
            relativeMoves = [[-1, -1], [-1, 1]];
        }
        // a relative moves looks like this: [row, col]
        for (let relativeMove of relativeMoves) {
            let row = this.row + relativeMove[0]; //
            let col = this.col + relativeMove[1];
            if (boardData.isEmpty(row, col)) { // Empty scenario
                absoluteMoves.push([row, col]);
            } else if (boardData.isPlayer(row, col, this.getOpponent())) { // Enemy scenario
                // TODO: opponent scenario - eat
                // absoluteMoves.push([row, col]); // We'll return enemy location in order to 'paint' it red
                // anotherEnemy - boolean: if(there's another enemy behind current enemy)
                const anotherEnemy = boardData.isPlayer(row + relativeMove[0], col + relativeMove[1], this.getOpponent());
                // anotherEnemy - boolean: if(there's a friendly behind current enemy)
                const anotherFriendly = boardData.isPlayer(row + relativeMove[0], col + relativeMove[1], this.player);
                if (!(anotherEnemy || anotherFriendly)) { // 'if' block that checks if we can eat the enemy
                    absoluteMoves.push([row + relativeMove[0], col + relativeMove[1]]); // Going above encountered enemy
                }
                else { continue; }
            } else if (boardData.isPlayer(row, col, this.player)) { // Same-piece scenario
                continue;
            }
        }
        for (let absoluteMove of absoluteMoves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredMoves.push(absoluteMove);
            }
        }
        return filteredMoves;
    }
}