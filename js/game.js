export function initGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

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
    wrongEaten: 0
  };

  const balls = [];
  const colors = ['red', 'blue', 'yellow', 'purple', 'lime'];

  function spawnBalls(count) {
    for (let i = 0; i < count; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 15 + Math.random() * 15,
        color: colors[Math.floor(Math.random() * colors.length)]
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
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
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
        balls.splice(i, 1);
      }
    }

    if (balls.length < 10) {
      spawnBalls(10);
    }

    if (player.score >= 1000) {
      alert('Ты победил!');
      location.reload();
    }

    if (player.wrongEaten > 3) {
      alert('Ты проиграл! Съел слишком много чужих шариков.');
      location.reload();
    }
  }

  window.addEventListener('mousemove', (e) => {
    player.x = e.clientX;
    player.y = e.clientY;
  });

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
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const menu = document.getElementById('menu');

  startButton.addEventListener('click', () => {
    menu.style.display = 'none';   // скрываем меню
    initGame();                    // запускаем игру
  });
});