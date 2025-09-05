export class PauseMenu{
  constructor(el){this.el=el;}
  show(){this.el.classList.remove('hidden');}
  hide(){this.el.classList.add('hidden');}
  bindNewRun(fn){const btn=this.el.querySelector('#newRunPause');if(btn)btn.onclick=fn;}
}
