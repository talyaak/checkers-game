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
                // Giving cells in our path a color
                cell.classList.add('possible-move');
            }
        }

        // Giving the selected piece's cell a color
        board.rows[row].cells[col].classList.add('selected');
        selectedPiece = piece;
    }
    tryMove(selectedPiece, row, col) {
        let anotherEnemy;
        /* 'if' block that, given there is an enemy in possibleMoves
        makes it so that eating enemy is the only option*/
        if (this.enemyCheck(selectedPiece)) {
            // true: moved diagonally only 1 while there was an enemy
            if (Math.abs(row - selectedPiece.row) === 1
                && Math.abs(col - selectedPiece.col) === 1) {
                console.log("test\ntried to flee from enemy!")
                return false;
            }
            else { // Moved more than 1, and there is another enemy
                console.log("check");
                anotherEnemy = true;
            }
        }
        // next blocks - no enemies in possibleMoves
        const possibleMoves = this.getPossibleMoves(selectedPiece);
        for (const possibleMove of possibleMoves) { // possibleMove example: [1,1], [-1,1]
            // 'if' block that checks if there is a legal move (within possibleMoves array)
            if (possibleMove[0] === row && possibleMove[1] === col) {
                this.eatPotentialEnemy(selectedPiece, row, col, possibleMove);
                selectedPiece.row = row;
                selectedPiece.col = col;
                if (anotherEnemy) {
                    if (!this.enemyCheck(selectedPiece)) {
                        this.currentPlayer = selectedPiece.getOpponent();
                    }
                    createCheckersBoard();
                }
                else { this.currentPlayer = selectedPiece.getOpponent(); }
                return true; // When move has been made, returns true
            }
        }
        return false; // No move made, returns false
    }
    // Check enemies inside selectedPiece's possibleMoves
    enemyCheck(selectedPiece) {
        let possibleMoves = selectedPiece.getPossibleMoves(this.boardData); // -> [[row,col],[row,col]]
        // if block below - true means there is a PossibleMove where an enemy can be eaten
        for (let possibleMove of possibleMoves) {
            /* if block: check if diagonal space between the piece and the selected
            move is bigger than 1 -> meaning that there's an enemy between them */
            if (Math.abs(possibleMove[0] - selectedPiece.row) > 1
                && Math.abs(possibleMove[1] - selectedPiece.col) > 1) {
                return true;
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

    // Check's if the game's rules for announcing a winner have been met
    checkForWinner() {
        // Win by score (consumed all enemies)
        if (this.blackTeamScore === 12 || this.whiteTeamScore === 12) {
            onSquareClick = function () { } // disabling further clicks
            if (this.blackTeamScore === 12) { winner = "Black Team"; }
            else { winner = "White Team"; }
            winnerAnnounce = winner + " WON!";

            // Win by disabling enemy's movement (Black wins)
        } else if (this.checkMovementDisability(WHITE_PLAYER)) {
            onSquareClick = function () { }
            winnerAnnounce = "Black Team WON!";

            // Win by disabling enemy's movement (White wins)
        } else if (this.checkMovementDisability(BLACK_PLAYER)) {
            onSquareClick = function () { }
            winnerAnnounce = "White Team WON!";
        }
    }
    /* A function that checks if current player has any "showdowns" (force-eat-enemy)
    In this case we allow movement only to pieces that are in showdown, if not -> continuing as usual */
    checkForShowdown() {
        let showdownPieces = [], haveMoves = [];
        for (let piece of this.boardData.pieces) {
            if (piece.player === this.currentPlayer) {
                let possibleMoves = piece.getPossibleMoves(this.boardData); // -> [[row,col],[row,col]]

                // if block below - true means there is a PossibleMove where an enemy can be eaten
                if (possibleMoves.length > 0) {
                    haveMoves.push(piece);  // Pieces with movement ability, used after 'for' block
                }
                for (let possibleMove of possibleMoves) {
                    if (Math.abs(possibleMove[0] - piece.row) > 1
                        && Math.abs(possibleMove[1] - piece.col) > 1) {
                        showdownPieces.push(piece);
                    }
                }
                authorizedPieces = showdownPieces;
            }
        }
        // There's no showdown, ergo authorizedMoves = currentPlayer's pieces that can move
        if (showdownPieces.length === 0) {
            authorizedPieces = haveMoves;
        }
    }
    /* Checks for 'player' if any of his pieces has possibleMoves
    True - player is disabled (enemy wins)
    False - player is OK, game continues */
    checkMovementDisability(player) {
        let playerDisabled = true;
        for (let piece of this.boardData.pieces) {
            if (piece.player === player) {
                if (piece.getPossibleMoves(this.boardData).length > 0) {
                    playerDisabled = false;
                }
            }
        }
        return playerDisabled;
    }

}