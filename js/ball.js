const BALL_SPEED = 2;
const BOUNCE_DAMPING = 0.85;

export class Ball {
    constructor(x, y, r, color, type = 'normal') {
        this.x = x;
        this.y = y;
        this.r = r;
        this.targetR = r;
        this.color = color;
        this.type = type;
        this.vx = (Math.random() - 0.5) * BALL_SPEED;
        this.vy = (Math.random() - 0.5) * BALL_SPEED;
        this.alpha = 1;
    }

    move(width, height) {
        this.x += this.vx;
        this.y += this.vy;
        // Столкновение с границами и отскок с потерей энергии
        if (this.x - this.r < 0) {
            this.x = this.r;
            this.vx *= -BOUNCE_DAMPING;
        }
        if (this.x + this.r > width) {
            this.x = width - this.r;
            this.vx *= -BOUNCE_DAMPING;
        }
        if (this.y - this.r < 0) {
            this.y = this.r;
            this.vy *= -BOUNCE_DAMPING;
        }
        if (this.y + this.r > height) {
            this.y = height - this.r;
            this.vy *= -BOUNCE_DAMPING;
        }
        // Плавное изменение радиуса
        this.r += (this.targetR - this.r) * 0.1;
    }

    setRadius(newR) {
        this.targetR = newR;
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.type === 'bonus' ? 30 : 15;
        ctx.beginPath();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
