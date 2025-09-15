import { initGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const menu = document.getElementById('menu');
  const langSelect = document.getElementById('langSelect');

  const rulesText = {
    ru: "Правила игры:\n- Управляйте шариком с помощью мыши, клавиш или сенсорного джойстика.\n- Ешьте только шарики своего цвета.\n- Проигрыш, если съедите больше 3 чужих шариков.\n- Победа, если наберёте 1000 очков.\nНажмите OK чтобы начать.",
    en: "Game Rules:\n- Control your ball using mouse, keyboard or touch joystick.\n- Eat only balls of your color.\n- Lose if you eat more than 3 wrong balls.\n- Win if you reach 1000 points.\nPress OK to start."
  };

  startButton.addEventListener('click', () => {
    const lang = langSelect.value;
    alert(rulesText[lang]); // показываем правила
    menu.style.display = 'none';

    // показываем джойстик только на мобильных
    if ('ontouchstart' in window) {
      document.getElementById('joystickContainer').style.display = 'block';
    }

    initGame();
  });
});
