import {createEntity} from './Entity.js';
import {ENTITY,TEAM} from '../engine/Types.js';
export function createPlayer(x,y){const e=createEntity(ENTITY.PLAYER,x,y,12,TEAM.PLAYER);e.hp=5;e.maxHp=5;e.dash=0;e.dashEnergy=1;e.crouch=false;return e;}
