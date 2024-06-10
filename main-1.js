// Initialize variables
let currentPlayer; // Tracks the current player
let playerSymbol; // Stores the symbol chosen by the player (X or O)
let computerSymbol; // Stores the symbol for the computer
let gameStatus = 'ongoing'; // Tracks the game status (ongoing, won, or tie)
let board = ['', '', '', '', '', '', '', '', '']; // Represents the game board, initially empty

// Define winning patterns
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to start the game
function startGame(symbol) {
    // Set player's and computer's symbols
    playerSymbol = symbol;
    computerSymbol = (symbol === 'X') ? 'O' : 'X';
    currentPlayer = playerSymbol;
    
    // Hide game options and display game container
    document.getElementById('gameOptions').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // Update game status and current player
    document.getElementById('gameStatus').textContent = `Game On: Player ${playerSymbol}'s Turn`;
    document.getElementById('currentPlayer').textContent = `Current Player: ${playerSymbol}`;
}

// Function to handle player moves
function makeMove(cell, index) {
    if (board[index] === '' && gameStatus === 'ongoing') {
        // Update board and cell content
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        
        // Check if game has ended
        if (checkGameEnd()) return;

        // Switch to the next player (player or computer)
        currentPlayer = currentPlayer === playerSymbol ? computerSymbol : playerSymbol;
        document.getElementById('currentPlayer').textContent = `Current Player: ${currentPlayer}`;
        document.getElementById('gameStatus').textContent = `Game On: ${currentPlayer === playerSymbol ? 'Player' : 'Computer'} ${currentPlayer}'s Turn`;

        // If it's the computer's turn, make a move after a delay
        if (currentPlayer === computerSymbol) {
            setTimeout(computerMove, 1500);
        }
    }
}

// Function for the computer's move
function computerMove() {
    if (gameStatus !== 'ongoing') return;

    let moveMade = false;

    // Try to win
    moveMade = findBestMove(computerSymbol);
    if (!moveMade) {
        // Block player from winning
        moveMade = findBestMove(playerSymbol);
    }

    // If no winning or blocking move, pick the first available cell
    if (!moveMade) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                document.querySelectorAll('.cell')[i].textContent = computerSymbol;
                break;
            }
        }
    }

    // Check if the game has ended
    if (checkGameEnd()) return;

    // Switch back to the player's turn
    currentPlayer = playerSymbol;
    document.getElementById('currentPlayer').textContent = `Current Player: ${currentPlayer}`;
    document.getElementById('gameStatus').textContent = `Game On: Player ${currentPlayer}'s Turn`;
}

// This function checks if the game has ended, either by a player winning or a tie.
function checkGameEnd() {
    const gameStatusElement = document.getElementById('gameStatus');
    const winPattern = checkWin(); // Check if there is a winning pattern
    if (winPattern) { // If there is a winning pattern
        // Update game status to display the winner
        gameStatusElement.textContent = `Player ${currentPlayer} Wins!`;
        // Apply styles for winning status
        gameStatusElement.style.color = '#ff4d6d'; 
        gameStatusElement.style.padding = '30px 40px'; 
        gameStatusElement.style.border = '2px solid #ff4d6d';
        gameStatusElement.style.boxShadow = '0 0 15px rgba(255, 77, 109, 0.7)';
        gameStatusElement.className = 'game-won'; // Apply win class
        gameStatus = 'won'; // Update game status
        drawWinningLine(winPattern); // Draw the winning line
        return true;
    } else if (board.every(cell => cell !== '')) { // If all cells are filled and no winner
        gameStatusElement.textContent = 'It\'s a Tie!'; // Update game status to indicate a tie
        // Apply styles for tie status
        gameStatusElement.style.color = '#edc4b3'; 
        gameStatusElement.style.padding = '30px 40px'; 
        gameStatusElement.style.border = '2px solid #edc4b3';
        gameStatusElement.style.boxShadow = '0 0 15px rgba(237, 196, 179, 0.7)';
        gameStatusElement.className = 'game-tie'; // Apply tie class
        gameStatus = 'tie'; // Update game status
        return true;
    }
    return false; // Return false if the game is still ongoing
}

// This function resets the game to its initial state.
function resetGame() {
    board = ['', '', '', '', '', '', '', '', '']; // Reset the board
    gameStatus = 'ongoing'; // Reset game status
    const gameStatusElement = document.getElementById('gameStatus');
    gameStatusElement.textContent = 'Game On: Player X\'s Turn'; // Update game status message
    gameStatusElement.className = 'game-ongoing'; // Apply ongoing class
    document.getElementById('currentPlayer').textContent = 'Current Player: X'; // Update current player indicator
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = ''; // Clear all cell contents
    });
    document.getElementById('winningLine').style.display = 'none'; // Hide winning line
    document.getElementById('gameOptions').style.display = 'block'; // Show game options
    document.getElementById('gameContainer').style.display = 'none'; // Hide game container
}

// This function checks if the current player has won the game.
function checkWin() {
    for (let pattern of winPatterns) { // Iterate over all winning patterns
        if (pattern.every(index => board[index] === currentPlayer)) { // If all cells in a pattern are filled by the current player
            return pattern; // Return the winning pattern
        }
    }
    return null; // Return null if no winning pattern is found
}

// This function draws a line through the winning pattern to indicate the win.
function drawWinningLine(pattern) {
    const line = document.getElementById('winningLine'); // Get the winning line element
    const firstCell = document.querySelector(`.cell:nth-child(${pattern[0] + 1})`); // Get the first cell of the pattern
    const lastCell = document.querySelector(`.cell:nth-child(${pattern[2] + 1})`); // Get the last cell of the pattern

    const firstRect = firstCell.getBoundingClientRect(); // Get the position of the first cell
    const lastRect = lastCell.getBoundingClientRect(); // Get the position of the last cell

    const boardRect = document.querySelector('.board').getBoundingClientRect(); // Get the position of the board

    // Calculate the coordinates and angle for the line
    const x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    const y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    const x2 = lastRect.left + lastRect.width / 2 - boardRect.left;
    const y2 = lastRect.top + lastRect.height / 2 - boardRect.top;

    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI); // Calculate the angle of the line
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Calculate the length of the line

    line.style.width = `${length}px`; // Set the width of the line
    line.style.transform = `rotate(${angle}deg)`; // Rotate the line to match the angle
    line.style.left = `${x1}px`; // Position the line horizontally
    line.style.top = `${y1 - 3}px`; // Position the line vertically (adjust for line height)

    line.style.display = 'block'; // Display the winning line
}

// This function finds the best move for the computer player.
function findBestMove(symbol) {
    for (let pattern of winPatterns) { // Iterate over all winning patterns
        const [a, b, c] = pattern;
        // If the current player has two cells in a winning pattern and the third cell is empty, fill that cell
        if (board[a] === symbol && board[b] === symbol && board[c] === '') {
            board[c] = computerSymbol; // Fill the empty cell with the computer symbol
            document.querySelectorAll('.cell')[c].textContent = computerSymbol; // Update the cell in the UI
            return true; // Return true to indicate a move was made
        } else if (board[a] === symbol && board[c] === symbol && board[b] === '') {
            board[b] = computerSymbol;
            document.querySelectorAll('.cell')[b].textContent = computerSymbol;
            return true;
        } else if (board[b] === symbol && board[c] === symbol && board[a] === '') {
            board[a] = computerSymbol;
            document.querySelectorAll('.cell')[a].textContent = computerSymbol;
            return true;
        }
    }
    return false; // Return false if no move was made
}
