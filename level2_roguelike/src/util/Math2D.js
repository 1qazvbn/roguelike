/** Basic 2D math helpers */
export const V = (x=0,y=0)=>({x,y});
export const add=(a,b)=>V(a.x+b.x,a.y+b.y);
export const sub=(a,b)=>V(a.x-b.x,a.y-b.y);
export const mul=(a,s)=>V(a.x*s,a.y*s);
export const len=(a)=>Math.hypot(a.x,a.y);
export const norm=(a)=>{const l=len(a)||1; return V(a.x/l,a.y/l);};
export const dist=(a,b)=>len(sub(a,b));
export const lerp=(a,b,t)=>a+(b-a)*t;
