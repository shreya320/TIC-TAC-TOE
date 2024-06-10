// Initialize game variables
let currentPlayer = 'X'; // Tracks the current player (X or O)
let gameStatus = 'ongoing'; // Tracks the game status (ongoing, won, or tie)
let board = ['', '', '', '', '', '', '', '', '']; // Represents the game board, initially empty

// Function to handle player moves
function makeMove(cell, index) {
    // Check if the selected cell is empty and the game is ongoing
    if (board[index] === '' && gameStatus === 'ongoing') {
        // Update the board with the current player's symbol
        board[index] = currentPlayer;
        // Display the player's symbol in the selected cell
        cell.textContent = currentPlayer;
        
        // Check for a win pattern
        const winPattern = checkWin();
        if (winPattern) {
            // If a win pattern is found, update game status and display the winning message
            document.getElementById('gameStatus').textContent = `Player ${currentPlayer} Wins!`;
            document.getElementById('gameStatus').style.color = '#ff4d6d'; 
            document.getElementById('gameStatus').style.padding = '30px 40px'; 
            document.getElementById('gameStatus').style.border = '2px solid #ff4d6d';
            document.getElementById('gameStatus').style.boxShadow = '0 0 15px rgba(255, 77, 109, 0.7)';
            gameStatus = 'won';
            // Draw the winning line
            drawWinningLine(winPattern);
        } else if (board.every(cell => cell !== '')) {
            // If all cells are filled and no win pattern is found, declare a tie
            document.getElementById('gameStatus').textContent = 'It\'s a Tie!';
            document.getElementById('gameStatus').style.color = '#edc4b3'; 
            document.getElementById('gameStatus').style.padding = '30px 40px'; 
            document.getElementById('gameStatus').style.border = '2px solid #edc4b3';
            document.getElementById('gameStatus').style.boxShadow = '0 0 15px rgba(237, 196, 179, 0.7)';
            gameStatus = 'tie';
        } else {
            // If the game is still ongoing, switch to the other player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('gameStatus').textContent = `Game On: Player ${currentPlayer}'s Turn`;
            document.getElementById('gameStatus').style.color = '#FFE6A7'; 
            document.getElementById('gameStatus').style.padding = '5px';
            document.getElementById('gameStatus').style.border = '1px dashed #fcf0d3';
            document.getElementById('gameStatus').style.boxShadow = 'none';
            document.getElementById('currentPlayer').textContent = `Current Player: ${currentPlayer}`;
        }
    }
}

// Function to check for a win pattern
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    // Check each win pattern
    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === currentPlayer)) {
            return pattern; // Return the winning pattern if found
        }
    }
    return null; // Return null if no win pattern is found
}

// Function to draw the winning line
function drawWinningLine(pattern) {
    const line = document.getElementById('winningLine');
    const firstCell = document.querySelector(`.cell:nth-child(${pattern[0] + 1})`);
    const lastCell = document.querySelector(`.cell:nth-child(${pattern[2] + 1})`);
    
    // Calculate the position and angle for the winning line
    const firstRect = firstCell.getBoundingClientRect();
    const lastRect = lastCell.getBoundingClientRect();
    const boardRect = document.querySelector('.board').getBoundingClientRect();
    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); 
    
    // Apply styles to the winning line
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1 - 3}px`;
    line.style.display = 'block';
}

// Function to reset the game
function resetGame() {
    // Reset game variables and board
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameStatus = 'ongoing';
    // Reset game status message and styles
    document.getElementById('gameStatus').textContent = 'Game On: Player X\'s Turn';
    document.getElementById('gameStatus').style.color = '#FFE6A7';
    document.getElementById('gameStatus').style.padding = '5px'; // Reset padding
    document.getElementById('gameStatus').style.border = '1px dashed #fcf0d3'; // Reset border
    document.getElementById('gameStatus').style.boxShadow = 'none'; // Reset box shadow
    document.getElementById('currentPlayer').textContent = 'Current Player: X';
    // Clear all cell contents
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
    // Hide the winning line
    document.getElementById('winningLine').style.display = 'none';
}