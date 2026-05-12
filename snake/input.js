// input.js — Keyboard, Remote, and Touch
const inputQueue = [];

function bindBtn(id, moveX, moveY) {
  const btn = document.getElementById(id);
  const trigger = (e) => {
    e.preventDefault();
    if (phase !== 'running') { start(); return; }
    handleMove(moveX, moveY);
  };
  btn.addEventListener('touchstart', trigger, { passive: false });
  btn.addEventListener('mousedown', trigger);
}

function handleMove(x, y) {
  const last = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : dir;
  if ((x !== 0 && last.x === 0) || (y !== 0 && last.y === 0)) {
    if (inputQueue.length < 2) inputQueue.push({ x, y });
  }
}

// Bind buttons
bindBtn('left',  -1,  0);
bindBtn('right',  1,  0);
bindBtn('up',     0, -1);
bindBtn('down',    0,  1);

// TV Remote & Keyboard
window.addEventListener('keydown', e => {
  // Start on Enter/OK
  if (phase !== 'running' && (e.key === 'Enter' || e.key === 'Select')) {
    start();
    return;
  }

  if (phase !== 'running') return;

  switch(e.key) {
    case 'ArrowUp':    handleMove(0, -1); break;
    case 'ArrowDown':  handleMove(0,  1); break;
    case 'ArrowLeft':  handleMove(-1, 0); break;
    case 'ArrowRight': handleMove(1,  0); break;
  }
});

// TV Mode Toggle
document.getElementById('toggle-ui').addEventListener('click', function() {
  document.querySelectorAll('.control-group').forEach(el => el.classList.toggle('hidden'));
  this.innerText = this.innerText.includes('Show') ? '📺 TV Mode' : '🎮 Show Controls';
});
