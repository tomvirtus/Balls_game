export function updateHUD(ctx, player, score, wrong, bonus, texts, lang){
    document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
    document.getElementById('wrongDisplay').innerText = `Wrong: ${wrong}`;
    document.getElementById('recordDisplay').innerText = `${texts[lang].high}: ${localStorage.getItem('highScore')||0}`;
    document.getElementById('bonusDisplay').innerText = texts[lang].bonus + (bonus||'None');
}
