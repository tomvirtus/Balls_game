
import { Player } from './player.js';
import { Ball } from './ball.js';
import { Particle } from './particle.js';
import { updateHUD } from './ui.js';
import { texts, randomChoice } from './utils.js';
import { eatSound, bonusSound, wrongSound, winSound, loseSound, bgMusic } from './audio.js';

const BALL_COLORS = ['red', 'blue', 'yellow', 'purple', 'lime'];
const INIT_PLAYER_RADIUS = 30;
const INIT_BALL_COUNT = 20;
const BALL_MIN_RADIUS = 15;
const BALL_MAX_RADIUS = 30;
const BONUS_CHANCE = 0.1;
const BONUS_SCORE = 200;
const NORMAL_SCORE = 50;
const WIN_SCORE = 1000;
const MAX_WRONG = 3;
const PARTICLE_COUNT = 10;

export function initGame(lang = 'ru') {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  bgMusic.play();

  const player = new Player(canvas.width / 2, canvas.height / 2, INIT_PLAYER_RADIUS, 'lime');
  let score = 0;
  let wrong = 0;
  let bonus = null;
  let highScore = Number(localStorage.getItem('highScore')) || 0;
  let paused = false;
  const balls = [];
  const particles = [];
  let colorTransition = null;

  function spawnBalls(count) {
    for (let i = 0; i < count; i++) {
      if (Math.random() < BONUS_CHANCE) {
        balls.push(new Ball(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          BALL_MAX_RADIUS,
          randomChoice(BALL_COLORS),
          'bonus'
        ));
      } else {
        balls.push(new Ball(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          BALL_MIN_RADIUS + Math.random() * (BALL_MAX_RADIUS - BALL_MIN_RADIUS),
          randomChoice(BALL_COLORS)
        ));
      }
    }
  }

  spawnBalls(INIT_BALL_COUNT);

  function setPlayerColor(newColor) {
    // Плавная смена цвета
    colorTransition = { from: player.color, to: newColor, progress: 0 };
  }

  function updatePlayerColor() {
    if (!colorTransition) return;
    colorTransition.progress += 0.05;
    if (colorTransition.progress >= 1) {
      player.color = colorTransition.to;
      colorTransition = null;
      return;
    }
    // Простая интерполяция цвета (по компонентам RGB)
    function hexToRgb(hex) {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
      const num = parseInt(hex,16);
      return [num>>16&255, num>>8&255, num&255];
    }
    function rgbToHex([r,g,b]) {
      return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
    }
    // поддержка именованных цветов
    const colorMap = {red:'#ff0000',blue:'#0000ff',yellow:'#ffff00',purple:'#800080',lime:'#00ff00'};
    const from = hexToRgb(colorMap[colorTransition.from]||colorTransition.from);
    const to = hexToRgb(colorMap[colorTransition.to]||colorTransition.to);
    const rgb = from.map((c,i)=>Math.round(c+(to[i]-c)*colorTransition.progress));
    player.color = rgbToHex(rgb);
  }

  function handleMove(x, y) {
    player.x = x;
    player.y = y;
  }
  window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', e => {
    if (e.touches.length) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, {passive:true});

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' || e.key === 'p') paused = !paused;
    if (e.key === 'r') location.reload();
  });

  function drawBalls() {
    for (const b of balls) b.draw(ctx);
  }

  function drawParticles() {
    for (const p of particles) p.draw(ctx);
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
  }

  function checkCollisions() {
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      const dx = player.x - b.x;
      const dy = player.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < player.r + b.r) {
        if (b.color === player.color) {
          player.targetR += 2;
          score += b.type === 'bonus' ? BONUS_SCORE : NORMAL_SCORE;
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
          }
          if (b.type === 'bonus') {
            bonus = texts[lang].bonus + b.color;
            setPlayerColor(b.color); // плавная смена цвета
            bonusSound.play();
          } else {
            eatSound.play();
          }
          for (let j = 0; j < PARTICLE_COUNT; j++) particles.push(new Particle(b.x, b.y, b.color));
        } else {
          wrong++;
          wrongSound.play();
        }
        balls.splice(i, 1);
      }
    }
    if (balls.length < 10) spawnBalls(10);
    if (score >= WIN_SCORE) {
      winSound.play();
      alert(texts[lang].win);
      location.reload();
    }
    if (wrong > MAX_WRONG) {
      loseSound.play();
      alert(texts[lang].lose);
      location.reload();
    }
  }

  function gameLoop() {
    if (paused) {
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#222';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Пауза', canvas.width/2, canvas.height/2);
      ctx.font = '20px Arial';
      ctx.fillText('Esc/p — пауза, r — рестарт', canvas.width/2, canvas.height/2+40);
      ctx.restore();
      requestAnimationFrame(gameLoop);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBalls();
    updatePlayerColor();
    player.draw(ctx);
    drawParticles();
    updateParticles();
    checkCollisions();
    updateHUD(ctx, player, score, wrong, bonus, texts, lang);
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
