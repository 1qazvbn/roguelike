import {circleVsTiles} from '../engine/Collision.js';
import {ENTITY} from '../engine/Types.js';
export function physicsSystem(entities,level,dt){
  for(const e of entities){
    e.pos.x+=e.vel.x*dt; e.pos.y+=e.vel.y*dt;
    if(e.kind===ENTITY.PROJECTILE){e.ttl-=dt;if(e.ttl<=0||level.isWall(e.pos.x/32|0,e.pos.y/32|0))e.dead=true;}
    else circleVsTiles(e,level);
  }
  return entities.filter(e=>!e.dead);
}
