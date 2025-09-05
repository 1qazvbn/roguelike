import {createEntity} from './Entity.js';
import {ENTITY,TEAM} from '../engine/Types.js';
export function createEnemy(type,x,y,depth=1){const e=createEntity(ENTITY.ENEMY,x,y,12,TEAM.ENEMY);e.type=type;e.speed=40*(1+0.1*(depth-1));e.fireCooldown=1/e.speed;return e;}
