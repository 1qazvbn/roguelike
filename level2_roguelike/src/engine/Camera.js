import { V, lerp } from '../util/Math2D.js';
/** Camera with soft follow and zoom */
export class Camera {
  constructor(w, h, zoom = 4) {
    this.pos = V();
    this.zoom = zoom;
    this.resize(w, h);
  }
  follow(target, level) {
    const desired = V(target.pos.x - this.w / 2, target.pos.y - this.h / 2);
    this.pos.x = lerp(this.pos.x, desired.x, 0.1);
    this.pos.y = lerp(this.pos.y, desired.y, 0.1);
    const maxX = level.width * 32 - this.w;
    const maxY = level.height * 32 - this.h;
    this.pos.x = Math.max(0, Math.min(this.pos.x, maxX));
    this.pos.y = Math.max(0, Math.min(this.pos.y, maxY));
  }
  resize(w, h) {
    this.w = w / this.zoom;
    this.h = h / this.zoom;
  }
  screenToWorld(p) {
    return V(p.x / this.zoom + this.pos.x, p.y / this.zoom + this.pos.y);
  }
  worldToScreen(p) {
    return V((p.x - this.pos.x) * this.zoom, (p.y - this.pos.y) * this.zoom);
  }
}
