const PARTICLE_MIN_RADIUS = 1.5;
const PARTICLE_MAX_RADIUS = 4;
const PARTICLE_FADE = 0.025;
const PARTICLE_GLOW = 12;
const PARTICLE_ROTATE_SPEED = 0.2;

function hexToRgb(hex) {
  hex = hex.replace('#','');
  if (hex.length === 3) hex = hex.split('').map(x=>x+x).join('');
  const num = parseInt(hex,16);
  return [num>>16&255, num>>8&255, num&255];
}
function rgbToHex([r,g,b]) {
  return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.radius = PARTICLE_MIN_RADIUS + Math.random() * (PARTICLE_MAX_RADIUS - PARTICLE_MIN_RADIUS);
        this.color = color;
        this.alpha = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.rotateSpeed = (Math.random() - 0.5) * PARTICLE_ROTATE_SPEED;
        // Для затухания цвета
        this.rgb = hexToRgb(this._colorToHex(color));
    }

    _colorToHex(color) {
        // поддержка именованных цветов
        const colorMap = {red:'#ff0000',blue:'#0000ff',yellow:'#ffff00',purple:'#800080',lime:'#00ff00'};
        return colorMap[color] || color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= PARTICLE_FADE;
        this.angle += this.rotateSpeed;
        // Плавное затухание цвета (к черному)
        this.rgb = this.rgb.map(c => Math.max(0, c - 2));
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = PARTICLE_GLOW;
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = rgbToHex(this.rgb);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
