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

const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  canvas.style.width=window.innerWidth+'px';
  canvas.style.height=window.innerHeight+'px';
  if(camera){camera.w=canvas.width;camera.h=canvas.height;}
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();
const menu=document.getElementById('menu');
const pauseEl=document.getElementById('pause');
const seedInput=document.getElementById('seedInput');
const newBtn=document.getElementById('newRun');
const contBtn=document.getElementById('continueRun');
const resumeBtn=document.getElementById('resume');
const restartBtn=document.getElementById('restart');
const exitBtn=document.getElementById('exit');
const storage=(()=>{try{return window.localStorage;}catch{return null;}})();
const lsGet=k=>storage?storage.getItem(k):null;
const lsSet=(k,v)=>{if(storage)try{storage.setItem(k,v);}catch{}};
const input=new Input(canvas);
let loop;let camera;let level;let player;let entities=[];let rng;let state='menu';let depth=1;let seedStr='';let fps=60, lastFps=0, fpsAccum=0, fpsCount=0;let debug=false;
function start(seed){seedStr=seed;rng=new RNG(hashSeed(seed));depth=1;menu.classList.add('hidden');initLevel();state='play';if(!loop)loop=new Loop(update,render);loop.start();}
function initLevel(){
  const data=generateDungeon(rng,64,64);
  level=new Level(data);
  player=createPlayer(data.playerSpawn.x,data.playerSpawn.y);
  entities=[player];
  spawnLevel(level,entities,rng,depth);
  camera=new Camera(canvas.width,canvas.height);
  resizeCanvas();
}
function nextLevel(){depth++;const best=parseInt(lsGet('bestDepth')||'0');if(depth>best)lsSet('bestDepth',depth);initLevel();}
 function update(dt){if(state!=='play')return;fpsAccum+=dt;fpsCount++;if(fpsAccum>1){fps=fpsCount/fpsAccum;fpsAccum=0;fpsCount=0;}const speed=80;player.vel.x=player.vel.y=0; if(input.down('KeyW'))player.vel.y=-speed; if(input.down('KeyS'))player.vel.y+=speed; if(input.down('KeyA'))player.vel.x-=speed; if(input.down('KeyD'))player.vel.x+=speed;aiSystem(entities,level,player,dt,rng);combatSystem({entities,player,input,rng,camera},dt);entities=physicsSystem(entities,level,dt);const room=level.rooms.find(r=>player.pos.x/32>=r.x&&player.pos.x/32<r.x+r.w&&player.pos.y/32>=r.y&&player.pos.y/32<r.y+r.h);if(room)level.visited.add(room.id);camera.follow(player,level);const stair=level.stairPos;if(Math.hypot(player.pos.x-stair.x,player.pos.y-stair.y)<20&&entities.filter(e=>e.kind==='enemy').length===0)nextLevel();if(input.down('Escape')){state='pause';pauseEl.classList.remove('hidden');}}
function render(){ctx.clearRect(0,0,canvas.width,canvas.height);if(state==='menu')return;ctx.save();ctx.translate(-camera.pos.x,-camera.pos.y);drawTiles();drawEntities();ctx.restore();drawHUD(ctx,{player,depth,seed:seedStr,fps,entities,debug});drawMinimap(ctx,level,player);drawCursor(ctx,input.mouse);if(player.crouch){ctx.strokeStyle='yellow';ctx.beginPath();ctx.arc(player.pos.x-camera.pos.x,player.pos.y-camera.pos.y,player.radius,0,Math.PI*2);ctx.stroke();}}
function drawTiles(){const TILE=32;for(let y=0;y<level.height;y++)for(let x=0;x<level.width;x++){const t=level.tiles[y*level.width+x];ctx.fillStyle=t?"#222":"#444";ctx.fillRect(x*TILE,y*TILE,TILE,TILE);}ctx.fillStyle='blue';const s=level.stairPos;ctx.fillRect(s.x-8,s.y-8,16,16);}
function drawEntities(){for(const e of entities){if(e===player){ctx.fillStyle='white';ctx.beginPath();ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();}else if(e.kind==='enemy'){ctx.fillStyle=e.type==='chaser'?"red":"orange";ctx.beginPath();ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();}else if(e.kind==='projectile'){ctx.fillStyle=e.team===1?"#0ff":"#f0f";ctx.beginPath();ctx.arc(e.pos.x,e.pos.y,e.radius,0,Math.PI*2);ctx.fill();}else if(e.kind==='item'){ctx.fillStyle=e.item==='medkit'?"#0f0":"#ff0";ctx.fillRect(e.pos.x-8,e.pos.y-8,16,16);}}}

function drawCursor(ctx,pos){ctx.save();ctx.translate(pos.x,pos.y);ctx.strokeStyle='red';ctx.fillStyle='red';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.stroke();ctx.fillRect(-2,-0.5,2,1);ctx.fillRect(1,-0.5,2,1);ctx.fillRect(-0.5,-2,1,2);ctx.fillRect(-0.5,1,1,2);ctx.restore();}
// menu buttons
newBtn.onclick=()=>{const s=seedInput.value||Math.random().toString(36).slice(2);lsSet('lastSeed',s);start(s);};
contBtn.onclick=()=>{const s=lsGet('lastSeed')||Math.random().toString(36).slice(2);start(s);};
resumeBtn.onclick=()=>{state='play';pauseEl.classList.add('hidden');};
restartBtn.onclick=()=>{pauseEl.classList.add('hidden');state='play';initLevel();};
exitBtn.onclick=()=>{pauseEl.classList.add('hidden');menu.classList.remove('hidden');state='menu';loop.stop();};
window.addEventListener('keydown',e=>{if(e.code==='F1')debug=!debug;});
if(new URLSearchParams(location.search).get('seed')){seedInput.value=new URLSearchParams(location.search).get('seed');}
