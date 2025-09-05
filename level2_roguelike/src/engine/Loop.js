/** Fixed timestep loop at 60 Hz */
export class Loop{
  constructor(update,render){this.update=update;this.render=render;this.running=false;this.last=0;this.acc=0;this.step=1/60;}
  start(){this.running=true;requestAnimationFrame(t=>this.frame(t/1000));}
  stop(){this.running=false;}
  frame(time){if(!this.running)return;const dt=time-this.last||0;this.last=time;this.acc+=dt;while(this.acc>this.step){this.update(this.step);this.acc-=this.step;}this.render();requestAnimationFrame(t=>this.frame(t/1000));}
}
