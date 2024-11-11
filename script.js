const gameBoard = document.getElementById("game-board");
const newGameBtn = document.getElementById("new-game-btn");
const gameOverOverlay = document.getElementById("game-over");
const restartGameBtn = document.getElementById("restart-game-btn");
const scoreDisplay = document.getElementById("score");

let grid = Array.from({ length: 4 }, () => Array(4).fill(null));
let score = 0;

// Track touch positions for swipe detection
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function initializeGame() {
  score = 0; // Reset score
  updateScoreDisplay();
  clearBoard();
  addRandomTile();
  addRandomTile();
  renderBoard();
  gameOverOverlay.classList.add('hidden'); // Hide game over message
}

function clearBoard() {
  gameBoard.innerHTML = '';
  grid = Array.from({ length: 4 }, () => Array(4).fill(null));
}

function addRandomTile() {
  const emptyCells = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (!grid[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function renderBoard() {
  gameBoard.innerHTML = '';
  grid.forEach(row => {
    row.forEach(cellValue => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (cellValue) {
        cell.textContent = cellValue;
        cell.classList.add(`tile-${cellValue}`);
      }
      gameBoard.appendChild(cell);
    });
  });

  if (checkGameOver()) {
    displayGameOver();
  }
}

function moveLeft() {
  let moved = false;
  for (let row = 0; row < 4; row++) {
    let newRow = grid[row].filter(value => value !== null);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i]; // Update score when tiles merge
        newRow[i + 1] = null;
      }
    }
    newRow = newRow.filter(value => value !== null);
    while (newRow.length < 4) {
      newRow.push(null);
    }
    if (grid[row].toString() !== newRow.toString()) {
      moved = true;
    }
    grid[row] = newRow;
  }
  updateScoreDisplay();
  return moved;
}

function rotateGrid() {
  grid = grid[0].map((_, i) => grid.map(row => row[i])).reverse();
}

function move(direction) {
  let moved = false;
  for (let i = 0; i < direction; i++) {
    rotateGrid();
  }
  moved = moveLeft();
  for (let i = direction; i < 4; i++) {
    rotateGrid();
  }
  if (moved) {
    addRandomTile();
    renderBoard();
  }
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      move(0);
      break;
    case "ArrowUp":
      move(1);
      break;
    case "ArrowRight":
      move(2);
      break;
    case "ArrowDown":
      move(3);
      break;
  }
});

// Mobile touch events for swipe gestures
gameBoard.addEventListener("touchstart", handleTouchStart, false);
gameBoard.addEventListener("touchmove", handleTouchMove, false);
gameBoard.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchMove(event) {
  // Prevent scrolling during swipe
  event.preventDefault();
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;
  handleSwipe();
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      move(2); // Swipe right
    } else {
      move(0); // Swipe left
    }
  } else {
    if (deltaY > 0) {
      move(3); // Swipe down
    } else {
      move(1); // Swipe up
    }
  }
}

function checkGameOver() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (grid[row][col] === null) {
        return false; // There's still a move to be made
      }
    }
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = grid[row][col];
      if ((col < 3 && value === grid[row][col + 1]) || 
          (row < 3 && value === grid[row + 1][col])) {
        return false; // A merge is still possible
      }
    }
  }

  return true; // No moves left
}

function displayGameOver() {
  gameOverOverlay.classList.remove('hidden'); // Show the game over message
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
}
document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const newGameBtn = document.getElementById("new-game-btn");
  const gameOverOverlay = document.getElementById("game-over");
  const restartGameBtn = document.getElementById("restart-game-btn");
  const scoreDisplay = document.getElementById("score");

  let grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  let score = 0;

  // Initialize the game when the DOM is fully loaded
  initializeGame();

  newGameBtn.addEventListener("click", initializeGame);
  restartGameBtn.addEventListener("click", initializeGame);

  function initializeGame() {
    score = 0; // Reset score
    updateScoreDisplay();
    clearBoard();
    addRandomTile();
    addRandomTile();
    renderBoard();
    gameOverOverlay.classList.add('hidden'); // Hide the game over message
  }

  function clearBoard() {
    gameBoard.innerHTML = '';
    grid = Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  function addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!grid[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderBoard() {
    gameBoard.innerHTML = '';
    grid.forEach(row => {
      row.forEach(cellValue => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (cellValue) {
          cell.textContent = cellValue;
          cell.classList.add(`tile-${cellValue}`);
        }
        gameBoard.appendChild(cell);
      });
    });

    if (checkGameOver()) {
      displayGameOver();
    }
  }

  function checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === null) {
          return false; // There's still a move to be made
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = grid[row][col];
        if ((col < 3 && value === grid[row][col + 1]) || 
            (row < 3 && value === grid[row + 1][col])) {
          return false; // A merge is still possible
        }
      }
    }

    return true; // No moves left
  }

  function displayGameOver() {
    gameOverOverlay.classList.remove('hidden'); // Show the game over message
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
  }
});


// Initialize the game
initializeGame();
