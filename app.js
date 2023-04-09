const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");


let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;
//Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  //passing a random 0-30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  //clearing the timer and reloading the page on game over
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = (e) => {
  // Changing velocity value based on key press
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach(key => {
    //Calling changeDirection on each key click and passing key dataset value as an abject
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}));
})

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div> `;

  //checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // Pushing food position to snake body array
    score++; // increment score by 1

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score: ${score}`;
    highScoreElement.innerHTML = `High Score: ${highScore}`;

    //   console.log(snakeBody);
  }

  for (let index = snakeBody.length - 1; index > 0; index--) {
    //shifting forwarding the values of the elements in the snake body by one
    snakeBody[index] = snakeBody[index - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; //setting first element of the snake body to current snake position
  //updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  //checking the snake's head position is out of wall, if so setting gameOver to true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }
  for (let index = 0; index < snakeBody.length; index++) {
    //adding a div for each part of the snake's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[index][1]}/${snakeBody[index][0]}"></div> `;
    //checking if the snake head hit the body, if so set gameOver to true
    if (
      index !== 0 &&
      snakeBody[0][1] === snakeBody[index][1] &&
      index !== 0 &&
      snakeBody[0][0] === snakeBody[index][0]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
