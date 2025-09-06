/** Keyboard and mouse state */
export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.mouse = { x: 0, y: 0, down: false };
    window.addEventListener('keydown', e => {
      this.keys.add(e.code);
      if (e.code === 'Escape') e.preventDefault();
    });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      const sx = canvas.width / r.width;
      const sy = canvas.height / r.height;
      this.mouse.x = (e.clientX - r.left) * sx;
      this.mouse.y = (e.clientY - r.top) * sy;
    });
    canvas.addEventListener('mousedown', e => { if (e.button === 0) this.mouse.down = true; });
    canvas.addEventListener('mouseup',   e => { if (e.button === 0) this.mouse.down = false; });
  }
  down(code) { return this.keys.has(code); }
  getMouseWorld(camera) {
    if (camera?.screenToWorld) {
      return camera.screenToWorld(this.mouse);
    }
    return { x: this.mouse.x, y: this.mouse.y };
  }
}
