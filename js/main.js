import { initGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const menu = document.getElementById('menu');
  const langSelect = document.getElementById('langSelect');

  const colors = ['red', 'blue', 'yellow', 'purple', 'lime'];

  const rulesText = {
    ru: "Правила игры:\n- Управляйте шариком с помощью мыши, клавиш или сенсорного джойстика.\n- Ешьте только шарики своего цвета.\n- Проигрыш, если съедите больше 3 чужих шариков.\n- Победа, если наберёте 1000 очков.\nНажмите OK чтобы начать.",
    en: "Game Rules:\n- Control your ball using mouse, keyboard or touch joystick.\n- Eat only balls of your color.\n- Lose if you eat more than 3 wrong balls.\n- Win if you reach 1000 points.\nPress OK to start."
  };

  function startGame() {
    const lang = langSelect.value;
    const playerColor = colors[Math.floor(Math.random() * colors.length)];
    alert(rulesText[lang]);
    menu.style.display = 'none';

    if ('ontouchstart' in window) {
      document.getElementById('joystickContainer').style.display = 'block';
    }

    initGame(lang, playerColor);
  }

  startButton.addEventListener('click', startGame);
});
