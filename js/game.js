export function initGame(lang = 'ru') {
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
    color: 'lime',
    score: 0,
    wrongEaten: 0,
    vx: 0,
    vy: 0
  };

  const balls = [];
  const colors = ['red', 'blue', 'yellow', 'purple', 'lime'];

  function spawnBalls(count) {
    for (let i = 0; i < count; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15 + Math.random() * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        eatenAnimation: 0
      });
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
      const dx = player.x - b.x;
      const dy = player.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

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

    if (balls.length < 15) spawnBalls(5); // динамическое появление шариков

    if (player.score >= 1000) {
      endGame(true);
    }

    if (player.wrongEaten > 3) {
      endGame(false);
    }
  }

  function endGame(won) {
    endScreen.style.display = 'block';
    endText.textContent = won ? (lang === 'ru' ? 'Вы победили!' : 'You win!') :
                                (lang === 'ru' ? 'Вы проиграли!' : 'You lose!');
  }

  restartButton.addEventListener('click', () => {
    location.reload(); // простой перезапуск игры
  });

  // мышь
  window.addEventListener('mousemove', e => {
    player.x = e.clientX;
    player.y = e.clientY;
  });

  // сенсорный джойстик
  const joystick = document.getElementById('joystick');
  const container = document.getElementById('joystickContainer');
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
