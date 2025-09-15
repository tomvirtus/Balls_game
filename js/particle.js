export class Particle {
    constructor(x,y,color){ this.x=x; this.y=y; this.vx=(Math.random()-0.5)*4; this.vy=(Math.random()-0.5)*4; this.color=color; this.alpha=1; }
    update(){ this.x+=this.vx; this.y+=this.vy; this.alpha-=0.02; }
    draw(ctx){ ctx.beginPath(); ctx.fillStyle=this.color; ctx.globalAlpha=this.alpha; ctx.arc(this.x,this.y,2,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
}
