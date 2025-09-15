import { initGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const menu = document.getElementById('menu');
  const hud = document.getElementById('hud');
  const langSelect = document.getElementById('langSelect');
  let currentLang = langSelect ? langSelect.value : 'ru';

  // Выбор языка
  if (langSelect) {
    langSelect.addEventListener('change', e => {
      currentLang = e.target.value;
    });
  }

  startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    if (hud) {
      hud.style.display = 'flex';
      hud.style.opacity = '1';
    }
    initGame(currentLang);
  });

  // Кнопка паузы
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      // Симулируем нажатие Esc
      document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape'}));
    });
  }

  // Кнопка рестарта
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      location.reload();
    });
  }
});
