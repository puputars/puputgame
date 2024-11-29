const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("startButton");

const boardSize = 20; // 20x20 grid
let snake = [{ x: 10, y: 10 }]; // Snake starting position
let direction = null; // Initial direction set to null
let food = { x: 5, y: 5 }; // Initial food position
let score = 0;
let gameInterval;

// Create the game board
function createBoard() {
  gameBoard.innerHTML = "";
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    gameBoard.appendChild(cell);
  }
}

// Get a specific cell based on coordinates
function getCell(x, y) {
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return null;
  return gameBoard.children[y * boardSize + x];
}

// Update the board (render snake and food)
function updateBoard() {
  Array.from(gameBoard.children).forEach((cell) =>
    cell.classList.remove("snake", "food")
  );

  // Render the snake
  snake.forEach((segment) => {
    const cell = getCell(segment.x, segment.y);
    if (cell) cell.classList.add("snake");
  });

  // Render the food
  const foodCell = getCell(food.x, food.y);
  if (foodCell) foodCell.classList.add("food");
}

// Move the snake
function moveSnake() {
  if (!direction) return; // Do nothing if no direction is set

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collisions (walls or self)
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop(); // Remove the tail if not eating food
  }

  updateBoard();
}

// Place food in a random location
function placeFood() {
  let newFoodPosition;
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } while (snake.some((segment) => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

  food = newFoodPosition;
}

// Handle keyboard input for direction change
function changeDirection(event) {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  const newDirection = keyMap[event.key];
  if (newDirection) {
    // Prevent reversing into the opposite direction
    if (
      snake.length > 1 &&
      newDirection.x === -direction?.x &&
      newDirection.y === -direction?.y
    ) {
      return;
    }
    direction = newDirection;
  }
}

// Start the game
function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = null; // Snake is stationary at the start
  score = 0;
  scoreDisplay.textContent = score;
  placeFood();
  updateBoard();

  clearInterval(gameInterval);
  gameInterval = setInterval(moveSnake, 200);
}

// End the game
function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Your score is ${score}.`);
}

// Initialize the game
createBoard();
updateBoard();
document.addEventListener("keydown", changeDirection);
startButton.addEventListener("click", startGame);
