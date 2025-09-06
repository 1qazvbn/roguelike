import {Loop} from './engine/Loop.js';
import {Input} from './engine/Input.js';
import {Camera} from './engine/Camera.js';
import {RNG,hashSeed} from './engine/RNG.js';
import {generateDungeon} from './world/DungeonGen.js';
import {Level} from './world/Level.js';
import {drawMinimap} from './world/Minimap.js';
import {spawnLevel} from './world/Spawns.js';
import {createPlayer} from './entities/Player.js';
import {physicsSystem} from './systems/PhysicsSystem.js';
import {aiSystem} from './systems/AISystem.js';
import {combatSystem} from './systems/CombatSystem.js';
import {drawHUD} from './ui/HUD.js';
import {PauseMenu} from './ui/PauseMenu.js';
import {VERSION} from './engine/Version.js';

document.title = `Roguelike v${VERSION}`;

const CROSSHAIR_BASE_SIZE = 5;

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
const menu   = document.getElementById('menu');
const seedInput = document.getElementById('seedInput');
const newBtn = document.getElementById('newRun');
const contBtn = document.getElementById('continueRun');
const pauseEl = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const restartBtn = document.getElementById('restart');
const exitBtn = document.getElementById('exit');
const input  = new Input(canvas);
let loop = null;
let camera = null;
let level = null, player = null, entities = [];
let rng = null, state = 'menu', depth = 1, seedStr = '';
let fps = 60, lastFps = 0, fpsAccum = 0, fpsCount = 0, debug = false;

function resizeCanvas(){
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 960;
  const cssH = canvas.clientHeight || 540;
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(1,0,0,1,0,0);
  if (camera) camera.resize(canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const pauseMenu = new PauseMenu(pauseEl); pauseMenu.bindNewRun(()=>start());
const storage = (()=>{try{return window.localStorage;}catch{return null;}})();
const lsGet = k=>storage?storage.getItem(k):null;
const lsSet = (k,v)=>{if(storage)try{storage.setItem(k,v);}catch{}};

function start(seed){
  if(!seed)seed=Math.random().toString(36).slice(2);
  seedStr = seed;
  rng = new RNG(hashSeed(seed));
  entities=[];level=null;player=null;camera=null;
  depth = 1;
  fps=60;fpsAccum=0;fpsCount=0;lastFps=0;
  menu.classList.add('hidden');
  canvas.classList.remove('hidden');
  pauseMenu.hide();
  initLevel();
  input.keys.clear();
  state='play';
  if(!loop) loop = new Loop(update,render);
  if(!loop.running) loop.start();
}
function initLevel(){
  const data=generateDungeon(rng,64,64);
  level=new Level(data);
  player=createPlayer(data.playerSpawn.x,data.playerSpawn.y);
  entities=[player];
  spawnLevel(level,entities,rng,depth);
  camera=new Camera(canvas.width,canvas.height,5);
  resizeCanvas();
}
function nextLevel(){
  depth++;
  const best=parseInt(lsGet('bestDepth')||'0');
  if(depth>best)lsSet('bestDepth',depth);
  initLevel();
}
function update(dt){
  if(state!=='play')return;
  fpsAccum+=dt;fpsCount++;if(fpsAccum>1){fps=fpsCount/fpsAccum;fpsAccum=0;fpsCount=0;}
  const speed=80;player.vel.x=player.vel.y=0;
  if(input.down('KeyW'))player.vel.y-=speed;
  if(input.down('KeyS'))player.vel.y+=speed;
  if(input.down('KeyA'))player.vel.x-=speed;
  if(input.down('KeyD'))player.vel.x+=speed;
  aiSystem(entities,level,player,dt,rng);
  combatSystem({entities,player,input,rng,camera},dt);
  entities=physicsSystem(entities,level,dt);
  const room=level.rooms.find(r=>player.pos.x/32>=r.x&&player.pos.x/32<r.x+r.w&&player.pos.y/32>=r.y&&player.pos.y/32<r.y+r.h);
  if(room)level.visited.add(room.id);
  camera.follow(player,level);
  const stair=level.stairPos;
  if(Math.hypot(player.pos.x-stair.x,player.pos.y-stair.y)<20&&entities.filter(e=>e.kind==='enemy').length===0)nextLevel();
  if(input.down('Escape')){state='pause';pauseMenu.show();}
}
function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(state==='menu')return;
  ctx.save();
  ctx.scale(camera.zoom,camera.zoom);
  ctx.translate(-camera.pos.x,-camera.pos.y);
  drawTiles();
  drawEntities();
  if(player.crouch){
    ctx.strokeStyle='yellow';
    ctx.beginPath();
    ctx.arc(player.pos.x,player.pos.y,player.radius,0,Math.PI*2);
    ctx.stroke();
  }
  ctx.restore();
  drawHUD(ctx,{player,depth,seed:seedStr,fps,entities,debug});
  drawMinimap(ctx,level,player);
  drawCursor(ctx,input.mouse,camera);
}
function drawTiles(){
  const TILE=32;
  for(let y=0;y<level.height;y++)for(let x=0;x<level.width;x++){
    const t=level.tiles[y*level.width+x];
    ctx.fillStyle=t?"#222":"#444";
    ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
  }
  ctx.fillStyle='blue';
  const s=level.stairPos;
  ctx.fillRect(s.x-8,s.y-8,16,16);
}
function drawEntities(){
  for(const e of entities){
    if(e===player){
      ctx.fillStyle='white';ctx.beginPath();
      ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();
    }else if(e.kind==='enemy'){
      ctx.fillStyle=e.type==='chaser'?"red":"orange";
      ctx.beginPath();ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();
    }else if(e.kind==='projectile'){
      ctx.fillStyle=e.team===1?"#0ff":"#f0f";
      ctx.beginPath();ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();
    }else if(e.kind==='item'){
      ctx.fillStyle=e.item==='medkit'?"#0f0":"#ff0";
      ctx.fillRect(e.pos.x-8,e.pos.y-8,16,16);
    }
  }
}
function drawCursor(ctx,pos,camera){
  if(!pos||typeof pos.x!=='number'||typeof pos.y!=='number')return;
  if(!drawCursor.img){
    const off=document.createElement('canvas');off.width=off.height=5;
    const ictx=off.getContext('2d');const id=ictx.createImageData(5,5);
    const px=(x,y,a=255)=>{const i=(y*5+x)*4;id.data[i]=255;id.data[i+1]=0;id.data[i+2]=0;id.data[i+3]=a;};
    [[2,0],[3,1],[4,2],[3,3],[2,4],[1,3],[0,2],[1,1]].forEach(([x,y])=>px(x,y));
    for(let x=0;x<5;x++)if(x!==2)px(x,2);
    for(let y=0;y<5;y++)if(y!==2)px(2,y);
    ictx.putImageData(id,0,0);drawCursor.img=off;
  }
  const zoom=camera?.zoom||1;
  const size=CROSSHAIR_BASE_SIZE*zoom;
  const x=pos.x-size/2;
  const y=pos.y-size/2;
  const smoothing=ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(drawCursor.img,x,y,size,size);
  ctx.imageSmoothingEnabled=smoothing;
}
newBtn.onclick=()=>{
  const s=(seedInput.value||Math.random().toString(36).slice(2));
  localStorage.setItem('lastSeed',s);
  start(s);
  console.debug('[NewRun]',s);
};
contBtn.onclick=()=>{
  const s=localStorage.getItem('lastSeed')||Math.random().toString(36).slice(2);
  start(s);
  console.debug('[Continue]',s);
};
resumeBtn.onclick=()=>{state='play';pauseMenu.hide();};
restartBtn.onclick=()=>{pauseMenu.hide();state='play';initLevel();};
exitBtn.onclick=()=>{pauseMenu.hide();menu.classList.remove('hidden');state='menu';if(loop)loop.stop();};
window.addEventListener('keydown',e=>{if(e.code==='F1')debug=!debug;});
if(new URLSearchParams(location.search).get('seed')){
  seedInput.value=new URLSearchParams(location.search).get('seed');
}
