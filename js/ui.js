
function animateValue(el, value) {
    if (!el) return;
    const current = Number(el.dataset.value) || 0;
    if (current === value) return;
    const step = (value - current) / 8;
    let frame = 0;
    function tick() {
        frame++;
        const newVal = Math.round(current + step * frame);
        el.innerText = el.title.replace('{val}', newVal);
        el.dataset.value = newVal;
        if (frame < 8) requestAnimationFrame(tick);
        else { el.innerText = el.title.replace('{val}', value); el.dataset.value = value; }
    }
    tick();
}

export function updateHUD(ctx, player, score, wrong, bonus, texts, lang) {
    const scoreEl = document.getElementById('scoreDisplay');
    const wrongEl = document.getElementById('wrongDisplay');
    const recordEl = document.getElementById('recordDisplay');
    const bonusEl = document.getElementById('bonusDisplay');
    const highScore = localStorage.getItem('highScore') || 0;

    if (scoreEl) {
        scoreEl.title = `${texts[lang].title}: {val}`;
        animateValue(scoreEl, score);
        scoreEl.style.fontWeight = score >= highScore ? 'bold' : 'normal';
    }
    if (wrongEl) {
        wrongEl.title = `${texts[lang].wrong}: {val}`;
        animateValue(wrongEl, wrong);
        wrongEl.style.color = wrong > 0 ? '#ff6a6a' : '#fff';
        wrongEl.style.fontWeight = wrong > 0 ? 'bold' : 'normal';
    }
    if (recordEl) {
        recordEl.title = `${texts[lang].high}: {val}`;
        animateValue(recordEl, highScore);
        recordEl.style.color = '#ffd700';
        recordEl.style.textShadow = '0 0 8px #ffd700';
    }
    if (bonusEl) {
        bonusEl.title = texts[lang].bonus + (bonus || 'None');
        bonusEl.innerText = bonus ? texts[lang].bonus + bonus : texts[lang].bonus + 'None';
        bonusEl.style.color = bonus ? '#7fffd4' : '#fff';
        bonusEl.style.fontWeight = bonus ? 'bold' : 'normal';
    }
}

export function showHUD(show = true) {
    const hud = document.getElementById('hud');
    if (hud) {
        hud.style.display = show ? 'flex' : 'none';
        hud.style.opacity = show ? '1' : '0';
    }
}
