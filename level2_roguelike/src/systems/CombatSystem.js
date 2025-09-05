import {ENTITY,TEAM} from '../engine/Types.js';
import {createProjectile} from '../entities/Projectile.js';
import {dist,norm,sub} from '../util/Math2D.js';

export function combatSystem(state,dt){
  const {entities,player,input,rng,camera}=state;
  player.shot=player.shot||0;
  player.dash=player.dash||0;
  player.dashEnergy=Math.min(1,player.dashEnergy+dt*0.2);
  player.shot-=dt;
  player.dash-=dt;
  const mw=input.getMouseWorld?input.getMouseWorld(camera):{x:(player?.pos.x||0),y:(player?.pos.y||0)};
  if(input.mouse.down&&player.shot<=0){
    const a=Math.atan2(mw.y-player.pos.y,mw.x-player.pos.x);
    state.entities.push(createProjectile(player,player.pos.x,player.pos.y,a,200,player.team));
    player.shot=0.3;
  }
  if(input.down('Space')&&player.dash<=0&&player.dashEnergy>0){
    const d=norm(sub(mw,player.pos));
    player.vel.x=d.x*300;
    player.vel.y=d.y*300;
    player.dash=0.3;
    player.dashEnergy-=0.5;
  }
  player.crouch=input.down('ShiftLeft');
  player.radius=player.crouch?8:12;
  for(const e of entities){
    if(e.kind===ENTITY.ENEMY&&e.shootAngle!=null){
      state.entities.push(createProjectile(e,e.pos.x,e.pos.y,e.shootAngle,150,TEAM.ENEMY));
      e.shootAngle=null;
    }
  }
  for(const p of entities.filter(e=>e.kind===ENTITY.PROJECTILE)){
    for(const t of entities.filter(e=>e.team!==p.team&&e.team!==TEAM.NEUTRAL)){
      if(t===player&&player.dash>0)continue;
      if(dist(p.pos,t.pos)<p.radius+t.radius){
        t.hp-=1;
        p.dead=true;
        if(t.hp<=0)t.dead=true;
      }
    }
  }
  for(const it of entities.filter(e=>e.kind==='item')){
    if(dist(it.pos,player.pos)<it.radius+player.radius){
      if(it.item==='medkit')player.hp=Math.min(player.maxHp,player.hp+2);
      if(it.item==='battery')player.dashEnergy=1;
      it.dead=true;
    }
  }
}

