import {TILE} from '../engine/Types.js';
import {V,dist} from '../util/Math2D.js';
/** Generates rooms and corridors */
export function generateDungeon(rng,width,height){
  const tiles=new Array(width*height).fill(TILE.WALL);
  const rooms=[];
  const roomCount=15;
  for(let i=0;i<roomCount;i++){
    const w=Math.floor(rng.range(6,12));
    const h=Math.floor(rng.range(6,12));
    const x=Math.floor(rng.range(1,width-w-1));
    const y=Math.floor(rng.range(1,height-h-1));
    const room={id:i,x,y,w,h,center:V(x+w/2,y+h/2)};
    if(rooms.some(r=>x<r.x+r.w+1 && x+w+1>r.x && y<r.y+r.h+1 && y+h+1>r.y))continue;
    rooms.push(room);
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)tiles[yy*width+xx]=TILE.FLOOR;
    if(rooms.length>1){const prev=rooms[rooms.length-2];carveCorridor(prev.center,room.center);}    
  }
  function carveCorridor(a,b){for(let x=Math.floor(Math.min(a.x,b.x));x<=Math.floor(Math.max(a.x,b.x));x++)tiles[Math.floor(a.y)*width+x]=TILE.FLOOR;for(let y=Math.floor(Math.min(a.y,b.y));y<=Math.floor(Math.max(a.y,b.y));y++)tiles[y*width+Math.floor(b.x)]=TILE.FLOOR;}
  const playerSpawn={x:rooms[0].center.x*32+16,y:rooms[0].center.y*32+16};
  let far=rooms[0];let farDist=0;for(const r of rooms){const d=dist(playerSpawn,{x:r.center.x*32+16,y:r.center.y*32+16});if(d>farDist){far=r;farDist=d;}}
  const stairPos={x:far.center.x*32+16,y:far.center.y*32+16};
  const enemySpawns=[];rooms.forEach((r,i)=>{if(i===0||r===far)return;enemySpawns.push({x:r.center.x*32+16,y:r.center.y*32+16});});
  return {width,height,tiles,rooms,playerSpawn,stairPos,enemySpawns};
}
