/** Renders minimap in top-right corner */
export function drawMinimap(ctx,level,player){
  const scale=4;const mapW=level.width*scale;ctx.save();ctx.translate(ctx.canvas.width-mapW-10,10);ctx.fillStyle='#552';ctx.fillRect(0,0,mapW,level.height*scale);
  for(const r of level.rooms){ctx.fillStyle=level.visited.has(r.id)?'#754':'#222';ctx.fillRect(r.x*scale,r.y*scale,r.w*scale,r.h*scale);} 
  const px=player.pos.x/32*scale,py=player.pos.y/32*scale;ctx.fillStyle='#fff';ctx.fillRect(px-2,py-2,4,4);
  const s=level.stairPos;const sx=s.x/32*scale,sy=s.y/32*scale;ctx.strokeStyle='yellow';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(sx,sy);ctx.stroke();ctx.fillStyle='yellow';ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-3,sy-3);ctx.lineTo(sx+3,sy-3);ctx.closePath();ctx.fill();
  ctx.restore();
}
