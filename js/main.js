import { Player } from './player.js';
import { Ball } from './ball.js';
import { Particle } from './particle.js';
import { eatSound, bonusSound, wrongSound, winSound, loseSound, bgMusic } from './audio.js';
import { randomChoice, texts } from './utils.js';
import { updateHUD } from './ui.js';

// Canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Game variables
let player = new Player(width/2, height/2, 20, 'yellow');
let balls = [];
let particles = [];
let score = 0;
let wrong = 0;
let bonus = null;
let lang = 'en';
let isGameOver = false;
let overlayAlpha = 0;
let resultAlpha = 0;
let resultText = '';
let highScore = localStorage.getItem('highScore') || 0;

// Colors
const colors = ['red', 'blue', 'green', 'yellow'];

// Spawn balls
function spawnBall(){
    let x = Math.random()*width;
    let y = Math.random()*height;
    let r = Math.random()*15 + 10;
    let color = randomChoice(colors);
    balls.push(new Ball(x, y, r, color));
}

// Handle resizing
window.addEventListener('resize', ()=>{
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

// Keyboard control
let keys = {};
window.addEventListener('keydown', e=>keys[e.key]=true);
window.addEventListener('keyup', e=>keys[e.key]=false);

// Joystick
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');
let stickPos = {x:0,y:0};
let dragging = false;
joystick.addEventListener('pointerdown', e=>{dragging=true;});
joystick.addEventListener('pointerup', e=>{dragging=false; stick.style.left='25px'; stick.style.top='25px'; stickPos={x:0,y:0};});
joystick.addEventListener('pointermove', e=>{
    if(dragging){
        let rect = joystick.getBoundingClientRect();
        let x = e.clientX - rect.left - 50;
        let y = e.clientY - rect.top - 50;
        let maxDist = 40;
        let dist = Math.sqrt(x*x + y*y);
        if(dist>maxDist){ x = x/dist*maxDist; y=y/dist*maxDist; }
        stick.style.left = `${25+x}px`;
        stick.style.top = `${25+y}px`;
        stickPos={x:x/40, y:y/40};
    }
});

// HUD
const langSelect = document.getElementById('langSelect');
langSelect.addEventListener('change', ()=>{lang=langSelect.value;});

// Start button
document.getElementById('startBtn').addEventListener('click', ()=>{resetGame();});

// Reset record
document.getElementById('resetRecordBtn').addEventListener('click', ()=>{
    localStorage.setItem('highScore',0);
    highScore=0;
});

// Social share
document.getElementById('shareBtn').addEventListener('click', ()=>{
    let text = `My Ball Game score: ${score}!`;
    if(navigator.share){
        navigator.share({title:'Ball Game', text, url:window.location.href});
    }else{
        alert(text);
    }
});

// Reset game
function resetGame(){
    player = new Player(width/2,height/2,20,'yellow');
    balls=[];
    particles=[];
    score=0;
    wrong=0;
    bonus=null;
    isGameOver=false;
    overlayAlpha=0;
    resultAlpha=0;
    resultText='';
}

// Collision detection
function checkCollisions(){
    balls.forEach((b,i)=>{
        let dx = b.x - player.x;
        let dy = b.y - player.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < b.r + player.r){
            if(b.color===player.color){
                score+=10;
                player.targetR += 1;
                eatSound.play();
                for(let j=0;j<5;j++) particles.push(new Particle(b.x,b.y,b.color));
            }else{
                wrong++;
                wrongSound.play();
                for(let j=0;j<5;j++) particles.push(new Particle(b.x,b.y,b.color));
            }
            balls.splice(i,1);
        }
    });
}

// Update game objects
function update(){
    if(isGameOver) return;
    // Player movement
    let speed = 5;
    let dx = 0, dy=0;
    if(keys['ArrowUp']) dy-=speed;
    if(keys['ArrowDown']) dy+=speed;
    if(keys['ArrowLeft']) dx-=speed;
    if(keys['ArrowRight']) dx+=speed;
    dx += stickPos.x*speed;
    dy += stickPos.y*speed;
    player.x += dx;
    player.y += dy;
    // Bounds
    player.x=Math.max(player.r,Math.min(width-player.r,player.x));
    player.y=Math.max(player.r,Math.min(height-player.r,player.y));
    // Balls
    balls.forEach(b=>b.move(width,height));
    // Particles
    particles.forEach((p,i)=>{ p.update(); if(p.alpha<=0) particles.splice(i,1); });
    // Spawn balls
    if(balls.length<20) spawnBall();
    // Check collisions
    checkCollisions();
    // Check game over
    if(wrong>3){ isGameOver=true; resultText=texts[lang].lose; loseSound.play(); }
    if(score>=1000){ isGameOver=true; resultText=texts[lang].win; winSound.play(); }
    // Update HUD
    if(score>highScore){ highScore=score; localStorage.setItem('highScore',highScore); }
    updateHUD(ctx,player,score,wrong,bonus,texts,lang);
}

// Draw
function draw(){
    ctx.clearRect(0,0,width,height);
    // Background
    ctx.fillStyle="#222";
    ctx.fillRect(0,0,width,height);
    // Balls
    balls.forEach(b=>b.draw(ctx));
    // Particles
    particles.forEach(p=>p.draw(ctx));
    // Player
    player.draw(ctx);
    // Overlay
    if(isGameOver){
        overlayAlpha+=0.02;
        ctx.fillStyle=`rgba(0,0,0,${Math.min(overlayAlpha,0.7)})`;
        ctx.fillRect(0,0,width,height);
        if(resultText){
            resultAlpha+=0.03;
            ctx.font=`${Math.max(40,width/20)}px Arial`;
            ctx.fillStyle=`rgba(255,255,255,${Math.min(resultAlpha,1)})`;
            ctx.textAlign='center';
            ctx.fillText(resultText,width/2,height/2);
        }
    }
}

// Main loop
function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start background music
bgMusic.play();
loop();
