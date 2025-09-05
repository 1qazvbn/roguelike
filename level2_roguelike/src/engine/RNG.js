/** Seeded RNG (mulberry32) */
export class RNG{
  constructor(seed){this.seed=seed>>>0;}
  next(){let t=this.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}
  range(min,max){return this.next()*(max-min)+min;}
  pick(arr){return arr[Math.floor(this.next()*arr.length)];}
}
export function hashSeed(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return h>>>0;}
