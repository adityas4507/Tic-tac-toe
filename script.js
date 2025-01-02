const board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
let gameOver = false;

// Initialize board and add event listeners to cells
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", handleHumanMove);
});

// Handle human player move
function handleHumanMove(event) {
    const index = event.target.getAttribute("data-index");

    if (board[index] === "" && !gameOver) {
        makeMove(index, human);
        if (!checkWin(board, human) && !checkDraw()) {
            setTimeout(aiMove, 500);
        }
    }
}

// AI makes a move
function aiMove() {
    const bestMove = getBestMove(board);
    makeMove(bestMove, ai);
}

// Make a move and update the board
function makeMove(index, player) {
    board[index] = player;
    document.querySelector(`.cell[data-index='${index}']`).innerText = player;

    if (checkWin(board, player)) {
        setTimeout(() => alert(`${player} wins!`), 100);
        gameOver = true;
    } else if (checkDraw()) {
        setTimeout(() => alert("It's a draw!"), 100);
        gameOver = true;
    }
}

// Check for a win condition
function checkWin(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => board[index] === player)
    );
}

// Check for a draw
function checkDraw() {
    return board.every(cell => cell !== "");
}

// Minimax algorithm to find the best move for the AI
function getBestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

// Minimax recursive function
function minimax(board, depth, isMaximizing) {
    if (checkWin(board, ai)) return 10 - depth;
    if (checkWin(board, human)) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = ai;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = human;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Reset the game
function resetGame() {
    board.fill("");
    gameOver = false;
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
}