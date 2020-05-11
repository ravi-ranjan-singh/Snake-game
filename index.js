const canvas = document.querySelector('#myCanvas');
let H = 600,
  W = 750;
canvas.width = W;
canvas.height = H;
let cxt = canvas.getContext('2d');
let score = 0;
let gameOver = false;

let dead = new Audio('Assets/dead.mp3');
let eat = new Audio('Assets/eat.mp3');
let up = new Audio('Assets/up.mp3');
let down = new Audio('Assets/down.mp3');
let left = new Audio('Assets/left.mp3');
let right = new Audio('Assets/right.mp3');
let food_img = new Image();

food_img.src = 'Assets/apple.png';
food_img.style.zIndex = '-1';

let food;
let game;

let snake = {
  init_length: 5,
  cells: [],
  blockSize: 30,
  direction: 'RIGHT',
  createSnake: function () {
    for (let i = 0; i < this.init_length; i++) {
      this.cells.push({ x: i, y: 0 });
    }
  },

  drawSnake: function () {
    this.cells.forEach((loc) => {
      cxt.fillStyle = 'white';
      cxt.fillRect(
        loc.x * this.blockSize,
        loc.y * this.blockSize,
        this.blockSize - 3,
        this.blockSize - 3
      );
    });
  },

  updateSnake: function () {
    let headX = this.cells[this.cells.length - 1].x;
    let headY = this.cells[this.cells.length - 1].y;

    if (headX == food.X && headY == food.Y) {
      eat.play();
      food = generateFoodLocation();
      score++;
    } else {
      this.cells.shift();
    }

    let nextX, nextY;

    switch (this.direction) {
      case 'UP':
        (nextX = headX), (nextY = headY - 1);
        break;
      case 'DOWN':
        (nextX = headX), (nextY = headY + 1);
        break;
      case 'RIGHT':
        (nextX = headX + 1), (nextY = headY);
        break;
      case 'LEFT':
        (nextX = headX - 1), (nextY = headY);
        break;

      default:
        break;
    }

    this.cells.push({ x: nextX, y: nextY });

    var last_x = Math.round(W / this.blockSize) - 1;
    var last_y = Math.round(H / this.blockSize) - 1;
    let last = this.cells.length - 1;
    if (
      this.cells[last].y < 0 ||
      this.cells[last].x < 0 ||
      this.cells[last].x > last_x ||
      this.cells[last].y > last_y
    ) {
      dead.play();
      gameOver = true;
    }
  },
};

const generateFoodLocation = () => {
  X = Math.floor((Math.random() * (W - 30)) / 30);
  Y = Math.floor((Math.random() * (H - 30)) / 30);
  return { X, Y };
};

food = generateFoodLocation();

const drawFood = () => {
  cxt.drawImage(food_img, food.X * 30, food.Y * 30, 30, 30);
};

const draw = () => {
  cxt.clearRect(0, 0, canvas.width, canvas.height);
  snake.drawSnake();
  drawFood();
};

const gameLoop = () => {
  if (gameOver == true) {
    clearInterval(f);
    document.querySelector('.gameOver').textContent = 'Game Over';
  } else {
    document.querySelector('.score').textContent = score;
    draw();
    snake.updateSnake();
  }
};

snake.createSnake();

setTimeout(() => {
  f = setInterval(gameLoop, 100);
}, 2000);

document.querySelector('body').addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      up.play();
      snake.direction = 'UP';
      break;
    case 'ArrowDown':
      snake.direction = 'DOWN';
      down.play();
      break;
    case 'ArrowRight':
      right.play();
      snake.direction = 'RIGHT';
      break;
    case 'ArrowLeft':
      left.play();
      snake.direction = 'LEFT';
      break;

    default:
      break;
  }
});
