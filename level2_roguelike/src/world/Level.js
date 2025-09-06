import {TILE} from '../engine/Types.js';
export class Level{
  constructor(data, opts = {}){
    Object.assign(this,data);
    this.renderMode = opts.renderMode || 'topdown';
    this.visited=new Set();
  }
  isWall(x,y){if(x<0||y<0||x>=this.width||y>=this.height)return true;return this.tiles[y*this.width+x]===TILE.WALL;}
}
