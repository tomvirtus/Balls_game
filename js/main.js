import { initGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const menu = document.getElementById('menu');

  startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    initGame(); // запускаем игру
  });
});
