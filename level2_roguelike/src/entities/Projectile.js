import {createEntity} from './Entity.js';
import {ENTITY} from '../engine/Types.js';
export function createProjectile(owner,x,y,dir,speed,team){const p=createEntity(ENTITY.PROJECTILE,x,y,4,team);p.vel={x:Math.cos(dir)*speed,y:Math.sin(dir)*speed};p.ttl=2;p.owner=owner;return p;}
