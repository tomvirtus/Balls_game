
export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function formatNumber(num) {
    return num.toLocaleString('en-US');
}

export function randomCoords(width, height, radius) {
    // Возвращает координаты так, чтобы шарик не выходил за границы
    return {
        x: radius + Math.random() * (width - 2 * radius),
        y: radius + Math.random() * (height - 2 * radius)
    };
}

export function hexToRgb(hex) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
    const num = parseInt(hex,16);
    return [num>>16&255, num>>8&255, num&255];
}

export function rgbToHex([r,g,b]) {
    return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

export function lerpColor(a, b, t) {
    // Интерполяция между двумя цветами (hex или rgb)
    const rgbA = typeof a === 'string' ? hexToRgb(a) : a;
    const rgbB = typeof b === 'string' ? hexToRgb(b) : b;
    return rgbToHex(rgbA.map((c, i) => Math.round(c + (rgbB[i] - c) * t)));
}

export const texts = {
    ru: {
        title: 'Игра Шарики',
        start: 'Старт',
        win: 'Вы выиграли!',
        lose: 'Вы проиграли!',
        high: 'Рекорд',
        reset: 'Сброс',
        bonus: 'Бонус: ',
        wrong: 'Ошибок',
        pause: 'Пауза',
        restart: 'Рестарт',
        tooltipPause: 'Пауза (Esc/p)',
        tooltipRestart: 'Рестарт (r)'
    },
    en: {
        title: 'Ball Game',
        start: 'Start',
        win: 'You Win!',
        lose: 'You Lose!',
        high: 'High',
        reset: 'Reset',
        bonus: 'Bonus: ',
        wrong: 'Wrong',
        pause: 'Pause',
        restart: 'Restart',
        tooltipPause: 'Pause (Esc/p)',
        tooltipRestart: 'Restart (r)'
    }
};
