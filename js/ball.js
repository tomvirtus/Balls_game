export class Ball {
    constructor(x,y,r,color,type='normal'){ this.x=x; this.y=y; this.r=r; this.color=color; this.type=type; this.vx=(Math.random()-0.5)*2; this.vy=(Math.random()-0.5)*2; }
    move(width,height){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>width) this.vx*=-1; if(this.y<0||this.y>height) this.vy*=-1; }
    draw(ctx){ ctx.save(); ctx.shadowColor=this.color; ctx.shadowBlur=15; ctx.beginPath(); ctx.fillStyle=this.color; ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
}
