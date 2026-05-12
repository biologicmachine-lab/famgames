// game.js — State & Engine
var COLS = 20, ROWS = 20, BASE_FPS = 8;
var snake, dir, nextDir, food, score, best = 0, phase = 'idle', loopTimer, currentFps, CELL;

function init() {
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  inputQueue.length = 0;
  score = 0;
  currentFps = BASE_FPS;
  placeFood();
}

function placeFood() {
  do {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function start() {
  init();
  phase = 'running';
  resetLoop();
}

function resetLoop() {
  if (loopTimer) clearInterval(loopTimer);
  loopTimer = setInterval(tick, 1000 / currentFps);
}

function tick() {
  if (inputQueue.length > 0) nextDir = inputQueue.shift();
  dir = nextDir;
  var head = { x: (snake[0].x + dir.x + COLS) % COLS, y: (snake[0].y + dir.y + ROWS) % ROWS };

  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    phase = 'dead';
    best = Math.max(best, score);
    clearInterval(loopTimer);
    draw();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score % 5 === 0) { currentFps++; resetLoop(); }
    placeFood();
  } else { snake.pop(); }
  draw();
}

function resize() {
  var size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7);
  CELL = Math.floor(size / COLS);
  canvas.width = canvas.height = CELL * COLS;
  draw();
}

window.addEventListener('resize', resize);
init();
resize();
