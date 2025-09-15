export class Player {
    constructor(x, y, r, color){ this.x=x; this.y=y; this.r=r; this.color=color; this.targetR=r; this.alpha=1; }
    draw(ctx){
        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.fillStyle=this.color;
        ctx.globalAlpha=this.alpha;
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        ctx.globalAlpha=1;
        ctx.restore();
        this.r+=(this.targetR-this.r)*0.05;
    }
}
