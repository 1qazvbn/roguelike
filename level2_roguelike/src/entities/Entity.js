import {TEAM} from '../engine/Types.js';
let nextId=1;
export function createEntity(kind,x=0,y=0,radius=10,team=TEAM.NEUTRAL){return{ id:nextId++,kind,pos:{x,y},vel:{x:0,y:0},radius,hp:1,team,ai:null};}
export function createItem(type,x,y){const e=createEntity('item',x,y,10,TEAM.NEUTRAL);e.item=type;return e;}
