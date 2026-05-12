// render.js — Drawing
var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

var COLORS = {
  bg: '#0f172a', grid: '#1e293b',
  snakeHead: '#4ade80', snakeBody: '#166534',
  food: '#f43f5e', text: '#f8fafc',
  dimText: '#64748b', overlay: 'rgba(15, 23, 42, 0.9)'
};

function draw() {
  var W = canvas.width, H = canvas.height;
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = COLORS.grid;
  for (var i = 0; i <= COLS; i++) {
    ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
  }

  ctx.fillStyle = COLORS.food;
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, CELL/2.5, 0, Math.PI*2);
  ctx.fill();

  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? COLORS.snakeHead : COLORS.snakeBody;
    ctx.fillRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3);
  });

  if (phase !== 'running') {
    ctx.fillStyle = COLORS.overlay;
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = COLORS.text;
    ctx.font = `bold ${CELL * 1.8}px sans-serif`;
    ctx.fillText(phase === 'idle' ? 'READY?' : 'GAME OVER', W/2, H/2);
    ctx.font = `${CELL * 0.8}px sans-serif`;
    ctx.fillStyle = COLORS.dimText;
    ctx.fillText(phase === 'idle' ? 'Press OK/Enter to Start' : `Score: ${score} | Best: ${best}`, W/2, H/2 + CELL * 1.5);
  } else {
    ctx.fillStyle = COLORS.dimText;
    ctx.font = `bold ${CELL}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(score, W - 10, CELL);
  }
}
