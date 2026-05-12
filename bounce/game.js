// ═══════════════════════════════════════════════════════════════════════════════
//  BOUNCE — 8 Original Levels
//  Physics: jump force -9, gravity 0.42, max jump height ~96px, air time ~43f
//  Ground: y=240. Low plat: y≈195. Mid: y≈160. High: y≈120. Peak: y≈85.
// ═══════════════════════════════════════════════════════════════════════════════

const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const W = canvas.width, H = canvas.height; // 400 × 270

// ── HUD elements ─────────────────────────────────────────────────────────────
const hudLv    = document.getElementById('hud-lv');
const hudHoops = document.getElementById('hud-hoops');
const hudLives = document.getElementById('hud-lives');

// ── Overlays ──────────────────────────────────────────────────────────────────
const screens = {
  start:    document.getElementById('startScreen'),
  lv:       document.getElementById('lvScreen'),
  death:    document.getElementById('deathScreen'),
  gameover: document.getElementById('gameOverScreen'),
  clear:    document.getElementById('clearScreen'),
};
function showScreen(id) {
  Object.values(screens).forEach(s => s.classList.add('hidden'));
  if (id) screens[id].classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LEVEL DEFINITIONS  (8 original levels, increasing difficulty)
// ═══════════════════════════════════════════════════════════════════════════════
const LEVEL_DEFS = [

// ── 1 · THE MEADOW ─────────────────────────────────── easy, 0 spikes, 3 hoops
{
  name:'LEVEL 1', sub:'THE MEADOW', worldW:1200,
  ground:[{x:0,y:240,w:1200,h:40}],
  platforms:[
    {x:185,y:198,w:105,h:12},
    {x:368,y:165,w:95,h:12},
    {x:535,y:200,w:88,h:12},
    {x:685,y:162,w:108,h:12},
    {x:870,y:198,w:95,h:12},
    {x:1030,y:160,w:130,h:12},
  ],
  spikes:[],
  hoops:[{x:238,y:148},{x:583,y:155},{x:1090,y:115}],
},

// ── 2 · ROCKY PASS ──────────────────────────────── 2 spikes on ground, 3 hoops
{
  name:'LEVEL 2', sub:'ROCKY PASS', worldW:1400,
  ground:[{x:0,y:240,w:1400,h:40}],
  platforms:[
    {x:162,y:196,w:90,h:12},
    {x:338,y:162,w:90,h:12},
    {x:505,y:198,w:80,h:12},
    {x:652,y:156,w:102,h:12},
    {x:820,y:195,w:90,h:12},
    {x:975,y:158,w:105,h:12},
    {x:1150,y:196,w:115,h:12},
  ],
  spikes:[
    {x:276,y:225,w:36,h:15},
    {x:752,y:225,w:36,h:15},
  ],
  hoops:[{x:212,y:150},{x:552,y:150},{x:1025,y:115}],
},

// ── 3 · SPIKE HILL ────────────────────── 2-step vertical, 4 spikes, 4 hoops
{
  name:'LEVEL 3', sub:'SPIKE HILL', worldW:1560,
  ground:[{x:0,y:240,w:1560,h:40}],
  platforms:[
    {x:150,y:196,w:82,h:12},
    {x:308,y:161,w:80,h:12},
    {x:458,y:124,w:78,h:12},   // high
    {x:608,y:161,w:78,h:12},
    {x:748,y:197,w:80,h:12},
    {x:892,y:156,w:88,h:12},
    {x:1055,y:119,w:86,h:12},  // high
    {x:1218,y:158,w:102,h:12},
  ],
  spikes:[
    {x:244,y:225,w:36,h:15},
    {x:543,y:225,w:36,h:15},
    {x:836,y:225,w:36,h:15},
    {x:1148,y:225,w:36,h:15},
  ],
  hoops:[{x:208,y:150},{x:508,y:80},{x:808,y:150},{x:1112,y:75}],
},

// ── 4 · THE VALLEY ──────────── 3 ground gaps, 5 spikes, 4 hoops, more vertical
{
  name:'LEVEL 4', sub:'THE VALLEY', worldW:1660,
  ground:[
    {x:0,  y:240,w:282,h:40},
    {x:362,y:240,w:240,h:40},
    {x:682,y:240,w:242,h:40},
    {x:1004,y:240,w:656,h:40},
  ],
  platforms:[
    {x:142,y:192,w:90,h:12},
    {x:292,y:155,w:90,h:12},
    {x:432,y:120,w:78,h:12},  // 2-step
    {x:574,y:155,w:80,h:12},
    {x:714,y:193,w:80,h:12},
    {x:858,y:152,w:90,h:12},
    {x:1014,y:116,w:88,h:12},  // 2-step
    {x:1174,y:155,w:90,h:12},
    {x:1350,y:194,w:95,h:12},
    {x:1514,y:155,w:115,h:12},
  ],
  spikes:[
    {x:295,y:228,w:52,h:12},  // gap 1
    {x:618,y:228,w:50,h:12},  // gap 2
    {x:938,y:228,w:52,h:12},  // gap 3
    {x:476,y:225,w:36,h:15},
    {x:806,y:225,w:36,h:15},
  ],
  hoops:[{x:342,y:112},{x:628,y:112},{x:1064,y:72},{x:1568,y:112}],
},

// ── 5 · STORM RIDGE ─────────── 6 spikes, tight platforms, 5 hoops, high chain
{
  name:'LEVEL 5', sub:'STORM RIDGE', worldW:1810,
  ground:[{x:0,y:240,w:1810,h:40}],
  platforms:[
    {x:132,y:198,w:72,h:12},
    {x:275,y:164,w:68,h:12},
    {x:414,y:128,w:68,h:12},
    {x:554,y:164,w:68,h:12},
    {x:688,y:198,w:70,h:12},
    {x:832,y:158,w:75,h:12},
    {x:982,y:118,w:78,h:12},   // 2-step
    {x:1136,y:158,w:75,h:12},
    {x:1286,y:198,w:75,h:12},
    {x:1436,y:158,w:80,h:12},
    {x:1598,y:118,w:96,h:12},  // 2-step
  ],
  spikes:[
    {x:210,y:225,w:34,h:15},
    {x:348,y:225,w:34,h:15},
    {x:624,y:225,w:34,h:15},
    {x:762,y:225,w:34,h:15},
    {x:1060,y:225,w:34,h:15},
    {x:1214,y:225,w:34,h:15},
  ],
  hoops:[{x:318,y:122},{x:468,y:85},{x:738,y:115},{x:1036,y:75},{x:1650,y:75}],
},

// ── 6 · SKY TEMPLE ─────────── 3-step chain (y≈88), 7 spikes, 5 hoops up high
{
  name:'LEVEL 6', sub:'SKY TEMPLE', worldW:1960,
  ground:[{x:0,y:240,w:1960,h:40}],
  platforms:[
    {x:122,y:198,w:66,h:12},
    {x:260,y:162,w:62,h:12},
    {x:390,y:124,w:62,h:12},
    {x:520,y:88,w:62,h:12},    // 3-step
    {x:650,y:124,w:62,h:12},
    {x:780,y:162,w:62,h:12},
    {x:910,y:124,w:64,h:12},
    {x:1046,y:88,w:64,h:12},   // 3-step
    {x:1182,y:124,w:64,h:12},
    {x:1318,y:162,w:68,h:12},
    {x:1460,y:122,w:72,h:12},
    {x:1608,y:86,w:80,h:12},   // 3-step
    {x:1758,y:126,w:92,h:12},
  ],
  spikes:[
    {x:190,y:225,w:34,h:15},
    {x:328,y:225,w:34,h:15},
    {x:460,y:225,w:34,h:15},
    {x:716,y:225,w:34,h:15},
    {x:846,y:225,w:34,h:15},
    {x:1118,y:225,w:34,h:15},
    {x:1380,y:225,w:34,h:15},
  ],
  hoops:[{x:314,y:120},{x:575,y:45},{x:1101,y:45},{x:1514,y:80},{x:1813,y:83}],
},

// ── 7 · ICE RUN ─────────────── narrow (w=56) zigzag, 10 spikes, 6 hoops
{
  name:'LEVEL 7', sub:'ICE RUN', worldW:2160,
  ground:[{x:0,y:240,w:2160,h:40}],
  platforms:[
    {x:112,y:200,w:58,h:12},
    {x:240,y:170,w:55,h:12},
    {x:360,y:135,w:55,h:12},
    {x:478,y:100,w:55,h:12},   // 2-step
    {x:596,y:135,w:55,h:12},
    {x:713,y:170,w:55,h:12},
    {x:838,y:130,w:58,h:12},
    {x:968,y:95,w:58,h:12},    // 2-step
    {x:1098,y:130,w:58,h:12},
    {x:1228,y:168,w:58,h:12},
    {x:1366,y:128,w:60,h:12},
    {x:1506,y:92,w:60,h:12},   // 2-step
    {x:1643,y:128,w:60,h:12},
    {x:1783,y:165,w:65,h:12},
    {x:1932,y:125,w:92,h:12},
  ],
  spikes:[
    {x:176,y:225,w:30,h:15},
    {x:304,y:225,w:30,h:15},
    {x:420,y:225,w:30,h:15},
    {x:538,y:225,w:30,h:15},
    {x:658,y:225,w:30,h:15},
    {x:898,y:225,w:30,h:15},
    {x:1033,y:225,w:30,h:15},
    {x:1438,y:225,w:30,h:15},
    {x:1578,y:225,w:30,h:15},
    {x:1848,y:225,w:30,h:15},
  ],
  hoops:[{x:293,y:128},{x:533,y:57},{x:898,y:52},{x:1163,y:88},{x:1561,y:50},{x:1984,y:83}],
},

// ── 8 · THE GAUNTLET ──────── ground gaps + 4-step chain (y≈60), 14 spikes, 6 hoops
{
  name:'LEVEL 8', sub:'THE GAUNTLET', worldW:2380,
  ground:[
    {x:0,   y:240,w:222,h:40},
    {x:302, y:240,w:180,h:40},
    {x:562, y:240,w:182,h:40},
    {x:824, y:240,w:1556,h:40},
  ],
  platforms:[
    {x:98, y:202,w:52,h:12},
    {x:213,y:168,w:50,h:12},
    {x:324,y:132,w:50,h:12},
    {x:435,y:96, w:52,h:12},   // 2-step
    {x:546,y:132,w:50,h:12},
    {x:660,y:168,w:50,h:12},
    {x:774,y:130,w:52,h:12},
    {x:888,y:95, w:52,h:12},   // 3-step from ground
    {x:1008,y:60,w:55,h:12},   // 4-step (extreme!)
    {x:1132,y:95, w:52,h:12},
    {x:1252,y:132,w:52,h:12},
    {x:1372,y:168,w:55,h:12},
    {x:1508,y:130,w:55,h:12},
    {x:1643,y:95, w:55,h:12},
    {x:1772,y:60, w:58,h:12},  // 4-step (extreme!)
    {x:1902,y:95, w:55,h:12},
    {x:2028,y:132,w:60,h:12},
    {x:2163,y:168,w:62,h:12},
    {x:2292,y:130,w:80,h:12},
  ],
  spikes:[
    {x:228,y:228,w:62,h:12},  // gap 1
    {x:488,y:228,w:60,h:12},  // gap 2
    {x:750,y:228,w:62,h:12},  // gap 3
    {x:164,y:225,w:26,h:15},
    {x:278,y:225,w:26,h:15},
    {x:450,y:225,w:26,h:15},
    {x:700,y:225,w:26,h:15},
    {x:858,y:225,w:26,h:15},
    {x:958,y:225,w:26,h:15},
    {x:1178,y:225,w:26,h:15},
    {x:1438,y:225,w:26,h:15},
    {x:1678,y:225,w:26,h:15},
    {x:1958,y:225,w:26,h:15},
    {x:2202,y:225,w:26,h:15},
  ],
  hoops:[{x:266,y:128},{x:491,y:53},{x:893,y:52},{x:1063,y:18},{x:1827,y:18},{x:2347,y:88}],
},

]; // end LEVEL_DEFS

// ═══════════════════════════════════════════════════════════════════════════════
//  GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════
let state = 'start';  // start | lv-intro | playing | death | gameover | clear
let lvIdx = 0;
let lives = 3;
let collectedHoops = 0;
let cameraX = 0;
let frame = 0;
let deathTimer = 0;
let level = null;

const ball = {
  x:40, y:220, radius:11,
  dx:0, dy:0, speed:3.5, jumpForce:-9, gravity:0.42,
  grounded:false, angle:0
};

// ── Input ─────────────────────────────────────────────────────────────────────
const keys = { left:false, right:false, up:false };
let upConsumed = false;

window.addEventListener('keydown', e => {
  if (e.code==='ArrowLeft')                    keys.left  = true;
  if (e.code==='ArrowRight')                   keys.right = true;
  if (e.code==='Space'||e.code==='ArrowUp') { keys.up = true; e.preventDefault(); }
  if ((e.code==='Space'||e.code==='ArrowUp') && state!=='playing') actionKey();
});
window.addEventListener('keyup', e => {
  if (e.code==='ArrowLeft')                    keys.left  = false;
  if (e.code==='ArrowRight')                   keys.right = false;
  if (e.code==='Space'||e.code==='ArrowUp') { keys.up = false; upConsumed = false; }
});

function bindBtn(id, key) {
  const el = document.getElementById(id);
  const on  = () => keys[key] = true;
  const off = () => { keys[key] = false; if (key==='up') upConsumed = false; };
  el.addEventListener('mousedown',   on);
  el.addEventListener('mouseup',     off);
  el.addEventListener('mouseleave',  off);
  el.addEventListener('touchstart',  e => { e.preventDefault(); on(); },  {passive:false});
  el.addEventListener('touchend',    e => { e.preventDefault(); off(); }, {passive:false});
  el.addEventListener('touchcancel', off);
}
bindBtn('leftBtn',  'left');
bindBtn('rightBtn', 'right');
bindBtn('upBtn',    'up');

// Jump btn also advances overlays
document.getElementById('upBtn').addEventListener('mousedown', () => { if (state!=='playing') actionKey(); });
document.getElementById('upBtn').addEventListener('touchstart', e => {
  if (state!=='playing') { e.preventDefault(); actionKey(); }
}, {passive:false});
['menuBtn','selectBtn'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('click', () => actionKey());
  el.addEventListener('touchend', e => { e.preventDefault(); actionKey(); }, {passive:false});
});

// ── State machine ─────────────────────────────────────────────────────────────
function actionKey() {
  if (state === 'start')    { lvIdx = 0; lives = 3; showLvIntro(); }
  else if (state === 'lv-intro') { beginLevel(); }
  else if (state === 'death')    {
    if (lives > 0) { showLvIntro(); }
    else { state = 'gameover'; showScreen('gameover'); }
  }
  else if (state === 'gameover') { lvIdx = 0; lives = 3; showLvIntro(); }
  else if (state === 'clear')    { lvIdx = 0; lives = 3; showLvIntro(); }
}

function showLvIntro() {
  const def = LEVEL_DEFS[lvIdx];
  document.getElementById('lvBadge').textContent    = def.name;
  document.getElementById('lvTitle').textContent    = def.sub;
  document.getElementById('lvHoopCount').textContent = `COLLECT ${def.hoops.length} HOOPS`;
  state = 'lv-intro';
  showScreen('lv');
}

function beginLevel() {
  const def = LEVEL_DEFS[lvIdx];
  // Deep-clone level (restore hoops each attempt)
  level = {
    worldW: def.worldW,
    ground: def.ground,
    platforms: def.platforms,
    spikes: def.spikes,
    hoops: def.hoops.map(h => ({...h, r:22, active:true})),
  };
  collectedHoops = 0;
  cameraX = 0;
  frame = 0;
  ball.x = 40; ball.y = 220;
  ball.dx = 0; ball.dy = 0; ball.grounded = false; ball.angle = 0;
  updateHUD();
  state = 'playing';
  showScreen(null);
}

function updateHUD() {
  hudLv.textContent    = `LV ${lvIdx+1}/8`;
  hudHoops.textContent = `● ${collectedHoops}/${level ? level.hoops.length : 0}`;
  hudLives.textContent = '♥ '.repeat(Math.max(lives,0)).trim() || '✕';
}

function loseLife() {
  lives--;
  updateHUD();
  state = 'death';
  if (lives <= 0) {
    setTimeout(() => { state='gameover'; showScreen('gameover'); }, 900);
  } else {
    showScreen('death');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UPDATE
// ═══════════════════════════════════════════════════════════════════════════════
function update() {
  if (state !== 'playing') return;
  frame++;

  // Jump (single press only)
  if (keys.up && !upConsumed && ball.grounded) {
    ball.dy = ball.jumpForce;
    ball.grounded = false;
    upConsumed = true;
  }
  if (!keys.up) upConsumed = false;

  // Horizontal
  if      (keys.left)  ball.dx = -ball.speed;
  else if (keys.right) ball.dx =  ball.speed;
  else                 ball.dx *= 0.80;

  // Physics
  ball.dy += ball.gravity;
  ball.x  += ball.dx;
  ball.y  += ball.dy;
  ball.angle += ball.dx * 0.06; // rolling rotation

  // Camera (smooth follow, keep ball in left 40%)
  const target = ball.x - W * 0.38;
  cameraX += (target - cameraX) * 0.14;
  cameraX = Math.max(0, Math.min(cameraX, level.worldW - W));

  // Left wall
  if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.dx = 0; }

  // ── Platform + ground collision (top-surface only) ─────────────────────────
  ball.grounded = false;
  const allPlat = [...level.ground, ...level.platforms];
  for (const p of allPlat) {
    const prevBottom = (ball.y - ball.dy) + ball.radius; // bottom last frame
    const curBottom  = ball.y + ball.radius;
    if (
      ball.x + ball.radius > p.x &&
      ball.x - ball.radius < p.x + p.w &&
      prevBottom <= p.y + 2 &&  // was above (or just at) platform top
      curBottom  >= p.y &&      // now at or below
      ball.dy >= 0
    ) {
      ball.y       = p.y - ball.radius;
      ball.dy      = 0;
      ball.grounded = true;
    }
  }

  // ── Hoop collection ────────────────────────────────────────────────────────
  for (const h of level.hoops) {
    if (!h.active) continue;
    if (Math.hypot(ball.x - h.x, ball.y - h.y) < h.r + ball.radius - 3) {
      h.active = false;
      collectedHoops++;
      updateHUD();
      if (collectedHoops >= level.hoops.length) {
        // Level complete!
        state = 'win-pending';
        setTimeout(() => {
          lvIdx++;
          if (lvIdx >= LEVEL_DEFS.length) {
            state = 'clear'; showScreen('clear');
          } else {
            showLvIntro();
          }
        }, 900);
        return;
      }
    }
  }

  // ── Spike collision ────────────────────────────────────────────────────────
  for (const s of level.spikes) {
    if (
      ball.x + ball.radius - 5 > s.x &&
      ball.x - ball.radius + 5 < s.x + s.w &&
      ball.y + ball.radius      > s.y + 4
    ) {
      loseLife(); return;
    }
  }

  // ── Fall off world ─────────────────────────────────────────────────────────
  if (ball.y - ball.radius > H + 30) { loseLife(); }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DRAW
// ═══════════════════════════════════════════════════════════════════════════════

// Per-level colour palettes (LCD tints)
const PALETTES = [
  {bg:'#8fa875',plat:'#1a3a08',mid:'#4a6a30',hoop:'#1a3a08',hoopDone:'#5a8a3a'},  // 1 green
  {bg:'#8fa875',plat:'#1a3a08',mid:'#4a6a30',hoop:'#1a3a08',hoopDone:'#5a8a3a'},  // 2
  {bg:'#8fa875',plat:'#1a3a08',mid:'#4a6a30',hoop:'#1a3a08',hoopDone:'#5a8a3a'},  // 3
  {bg:'#8fa875',plat:'#234410',mid:'#4a6a30',hoop:'#234410',hoopDone:'#5a8a3a'},  // 4 valley
  {bg:'#8ba07a',plat:'#1a3a08',mid:'#4a6a30',hoop:'#1a3a08',hoopDone:'#5a8a3a'},  // 5
  {bg:'#8fa880',plat:'#1a3808',mid:'#3d5e28',hoop:'#1a3808',hoopDone:'#4e7a2a'},  // 6
  {bg:'#92aaa0',plat:'#0f302e',mid:'#2e5850',hoop:'#0f302e',hoopDone:'#3a7a6a'},  // 7 ice (teal)
  {bg:'#8a8a8a',plat:'#1a1a1a',mid:'#3a3a3a',hoop:'#1a1a1a',hoopDone:'#666'},    // 8 dark
];

function draw() {
  if (!level) {
    ctx.fillStyle = '#8fa875';
    ctx.fillRect(0, 0, W, H);
    return;
  }
  const P = PALETTES[lvIdx] || PALETTES[0];

  // Background
  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-Math.round(cameraX), 0);
  const cx = Math.round(cameraX);

  // Subtle dot grid
  ctx.fillStyle = 'rgba(13,26,5,0.07)';
  const gs = 20;
  const gx0 = Math.floor(cx / gs) * gs;
  for (let x = gx0; x < cx + W + gs; x += gs)
    for (let y = 0; y < H; y += gs)
      ctx.fillRect(x, y, 1, 1);

  // Ground & platforms
  const allPlat = [...level.ground, ...level.platforms];
  for (const p of allPlat) {
    // Skip if off screen
    if (p.x + p.w < cx - 10 || p.x > cx + W + 10) continue;

    ctx.fillStyle = P.plat;
    ctx.fillRect(p.x, p.y, p.w, p.h);
    // Top highlight
    ctx.fillStyle = P.mid;
    ctx.fillRect(p.x, p.y, p.w, 3);
    // Texture dots
    ctx.fillStyle = 'rgba(13,26,5,0.18)';
    for (let tx = p.x + 5; tx < p.x + p.w - 4; tx += 8)
      ctx.fillRect(tx, p.y + 6, 2, 2);
  }

  // Spikes
  for (const s of level.spikes) {
    if (s.x + s.w < cx - 5 || s.x > cx + W + 5) continue;
    ctx.fillStyle = P.plat;
    // Base bar
    ctx.fillRect(s.x, s.y + s.h - 3, s.w, 3);
    // Triangle spikes
    const n = Math.max(1, Math.floor(s.w / 12));
    const sw = s.w / n;
    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(s.x + i * sw,        s.y + s.h);
      ctx.lineTo(s.x + i * sw + sw/2, s.y);
      ctx.lineTo(s.x + (i+1) * sw,    s.y + s.h);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Hoops
  for (const h of level.hoops) {
    if (h.x < cx - 50 || h.x > cx + W + 50) continue;
    const pulse = h.active ? Math.sin(frame * 0.07) * 2.2 : 0;
    const r = h.r + pulse;

    if (h.active) {
      // Outer glow ring
      ctx.strokeStyle = P.mid;
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.arc(h.x, h.y, r + 3, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.strokeStyle = P.hoop;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(h.x, h.y, r, 0, Math.PI * 2); ctx.stroke();

      ctx.strokeStyle = P.mid;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(h.x, h.y, r - 7, 0, Math.PI * 2); ctx.stroke();

      ctx.fillStyle = P.hoop;
      ctx.fillRect(h.x - 2, h.y - 2, 4, 4);
    } else {
      // Collected — faded with tick
      ctx.strokeStyle = P.hoopDone;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(h.x - 7, h.y);
      ctx.lineTo(h.x - 2, h.y + 6);
      ctx.lineTo(h.x + 8, h.y - 7);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Ball shadow
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#0d1a05';
  ctx.beginPath();
  ctx.ellipse(ball.x, ball.y + ball.radius + 1, ball.radius * 0.85, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Ball body (with rolling rotation)
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(ball.angle);
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  ctx.strokeStyle = '#7a1a0a';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Seam line
  ctx.strokeStyle = 'rgba(255,120,100,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-ball.radius + 3, 0);
  ctx.lineTo(ball.radius - 3, 0);
  ctx.stroke();
  // Shine
  ctx.beginPath();
  ctx.arc(-3.5, -4, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,190,170,0.45)';
  ctx.fill();
  ctx.restore();

  ctx.restore(); // end camera transform

  // ── Fixed HUD overlays ──────────────────────────────────────────────────────
  if (state === 'playing' || state === 'win-pending') {
    // Progress bar at bottom
    const progress = Math.min(ball.x / (level.worldW - W * 0.5), 1);
    ctx.fillStyle = 'rgba(13,26,5,0.15)';
    ctx.fillRect(10, H - 7, W - 20, 3);
    ctx.fillStyle = P.hoop;
    ctx.fillRect(10, H - 7, (W - 20) * progress, 3);
  }

  if (state === 'win-pending') {
    // Bright flash on collection
    ctx.fillStyle = 'rgba(197,224,138,0.3)';
    ctx.fillRect(0, 0, W, H);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOOP
// ═══════════════════════════════════════════════════════════════════════════════
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Kick off
showScreen('start');
loop();
