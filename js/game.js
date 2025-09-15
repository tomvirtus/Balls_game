export function initGame(lang = 'ru', playerColor = 'lime') {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const endScreen = document.getElementById('endScreen');
  const endText = document.getElementById('endText');
  const restartButton = document.getElementById('restartButton');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    color: playerColor,
    score: 0,
    wrongEaten: 0
  };

  const balls = [];
  const colors = ['red', 'blue', 'yellow', 'purple', playerColor];

  // создаём шарик в свободном месте
  function createBall(color) {
    let x, y, radius;
    radius = 15 + Math.random() * 15;

    let safe = false;
    while (!safe) {
      x = Math.random() * (canvas.width - 2 * radius) + radius;
      y = Math.random() * (canvas.height - 2 * radius) + radius;
      safe = true;
      for (const b of balls) {
        if (Math.hypot(x - b.x, y - b.y) < radius + b.radius + 5) {
          safe = false;
          break;
        }
      }
      if (Math.hypot(x - player.x, y - player.y) < radius + player.radius + 10) {
        safe = false;
      }
    }

    balls.push({ x, y, radius, color, eatenAnimation: 0 });
  }

  function spawnBalls(count) {
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      createBall(color);
    }
  }

  spawnBalls(20);

  function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
  }

  function drawBalls() {
    for (const b of balls) {
      if (b.eatenAnimation > 0) {
        ctx.globalAlpha = b.eatenAnimation;
        b.eatenAnimation -= 0.05;
      } else {
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function checkCollisions() {
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      const dist = Math.hypot(player.x - b.x, player.y - b.y);
      if (dist < player.radius + b.radius) {
        if (b.color === player.color) {
          player.radius += 2;
          player.score += 50;
        } else {
          player.wrongEaten++;
        }
        b.eatenAnimation = 1;
        balls.splice(i, 1);
      }
    }

    if (balls.length < 15) spawnBalls(5);

    const uniqueColors = [...new Set(balls.map(b => b.color))];
    if (uniqueColors.length <= 3) {
      const availableColors = colors.filter(c => c !== player.color);
      for (let i = 0; i < 3; i++) {
        createBall(availableColors[Math.floor(Math.random() * availableColors.length)]);
      }
    }

    if (player.score >= 1000) endGame(true);
    if (player.wrongEaten > 3) endGame(false);
  }

  function endGame(won) {
    endScreen.style.display = 'block';
    endText.textContent = won ? (lang === 'ru' ? 'Вы победили!' : 'You win!') :
                                (lang === 'ru' ? 'Вы проиграли!' : 'You lose!');
  }

  restartButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    player.color = colors[Math.floor(Math.random() * colors.length)];
    player.score = 0;
    player.wrongEaten = 0;
    player.radius = 30;
    balls.length = 0;
    spawnBalls(20);
  });

  // мышь
  window.addEventListener('mousemove', e => {
    player.x = e.clientX;
    player.y = e.clientY;
  });

  // сенсорный джойстик
  const joystick = document.getElementById('joystick');
  let dragging = false;
  let startX = 0, startY = 0;

  joystick.addEventListener('touchstart', e => {
    dragging = true;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  joystick.addEventListener('touchmove', e => {
    if (!dragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    player.x += dx * 0.5;
    player.y += dy * 0.5;
    startX = touch.clientX;
    startY = touch.clientY;
    e.preventDefault();
  });

  joystick.addEventListener('touchend', () => dragging = false);

  function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Очки: ${player.score}`, 20, 30);
    ctx.fillText(`Ошибок: ${player.wrongEaten}`, 20, 60);
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBalls();
    drawPlayer();
    checkCollisions();
    drawScore();

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}
