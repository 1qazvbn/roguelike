/** Keyboard and mouse state */
export class Input{
  constructor(canvas){
    this.keys=new Set();
    this.mouse={x:0,y:0,down:false};
    window.addEventListener('keydown',e=>{this.keys.add(e.code);if(e.code==='Escape')e.preventDefault();});
    window.addEventListener('keyup',e=>this.keys.delete(e.code));
    canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();this.mouse.x=e.clientX-r.left;this.mouse.y=e.clientY-r.top;});
    canvas.addEventListener('mousedown',()=>this.mouse.down=true);
    canvas.addEventListener('mouseup',()=>this.mouse.down=false);
  }
  down(code){return this.keys.has(code);}
}
