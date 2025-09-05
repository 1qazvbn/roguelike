import {VERSION} from '../engine/Version.js';
export function drawHUD(ctx,state){
  const {player,depth,seed,fps,entities}=state;
  ctx.fillStyle='#fff';
  ctx.fillText(`Depth ${depth}`,10,20);
  ctx.fillText(`Seed ${seed}`,10,40);
  ctx.fillStyle='red';
  ctx.fillRect(10,50,100,10);
  ctx.fillStyle='green';
  ctx.fillRect(10,50,100*(player.hp/player.maxHp),10);
  ctx.fillStyle='#555';
  ctx.fillRect(10,70,100,6);
  ctx.fillStyle='cyan';
  ctx.fillRect(10,70,100*player.dashEnergy,6);
  if(state.debug){
    ctx.fillStyle='#fff';
    ctx.fillText(`FPS ${fps.toFixed(0)}`,10,90);
    ctx.fillText(`Entities ${entities.length}`,10,110);
  }
  const text=`v${VERSION}`;
  const canvas=ctx.canvas;
  ctx.save();
  ctx.font='12px monospace';
  ctx.textBaseline='bottom';
  ctx.textAlign='right';
  const pad=8;
  ctx.globalAlpha=0.85;
  const w=ctx.measureText(text).width+6;
  const h=14;
  const x=canvas.width-pad,y=canvas.height-pad;
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.fillRect(x-w,y-h,w,h);
  ctx.fillStyle='#fff';
  ctx.fillText(text,x-3,y-2);
  ctx.restore();
}
