const PLAYER_GLOW = 24;
const PLAYER_RADIUS_SPEED = 0.08;
const PLAYER_FLASH_ALPHA = 0.7;

export class Player {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.targetR = r;
        this.color = color;
        this.targetColor = color;
        this.alpha = 1;
        this.flash = false;
        this.flashTimer = 0;
    }

    setRadius(newR) {
        this.targetR = newR;
    }

    setColor(newColor) {
        this.targetColor = newColor;
    }

    triggerFlash() {
        this.flash = true;
        this.flashTimer = 8;
    }

    update() {
        // Плавное изменение радиуса
        this.r += (this.targetR - this.r) * PLAYER_RADIUS_SPEED;
        // Плавная смена цвета
        if (this.color !== this.targetColor) {
            // Простая интерполяция RGB
            function hexToRgb(hex) {
                hex = hex.replace('#','');
                if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
                const num = parseInt(hex,16);
                return [num>>16&255, num>>8&255, num&255];
            }
            function rgbToHex([r,g,b]) {
                return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
            }
            const colorMap = {red:'#ff0000',blue:'#0000ff',yellow:'#ffff00',purple:'#800080',lime:'#00ff00'};
            const from = hexToRgb(colorMap[this.color]||this.color);
            const to = hexToRgb(colorMap[this.targetColor]||this.targetColor);
            const rgb = from.map((c,i)=>Math.round(c+(to[i]-c)*0.1));
            this.color = rgbToHex(rgb);
            // Если почти совпало — фиксируем
            if (this.color === this.targetColor) this.color = this.targetColor;
        }
        // Flash эффект
        if (this.flash) {
            this.alpha = PLAYER_FLASH_ALPHA;
            this.flashTimer--;
            if (this.flashTimer <= 0) {
                this.flash = false;
                this.alpha = 1;
            }
        }
    }

    draw(ctx) {
        this.update();
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = PLAYER_GLOW;
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
