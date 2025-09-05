import {createEnemy} from '../entities/Enemy.js';
import {createItem} from '../entities/Entity.js';
/** Spawn enemies/items for a level */
export function spawnLevel(level,entities,rng,depth){
  const enemies=[];
  for(const s of level.enemySpawns){const type=rng.next()<0.4+depth*0.05?'shooter':'chaser';enemies.push(createEnemy(type,s.x,s.y,depth));}
  entities.push(...enemies);
  if(level.rooms[1]){const r=level.rooms[1];entities.push(createItem('medkit',(r.x+1)*32,(r.y+1)*32));}
  if(level.rooms[2]){const r=level.rooms[2];entities.push(createItem('battery',(r.x+r.w-2)*32,(r.y+r.h-2)*32));}
}
