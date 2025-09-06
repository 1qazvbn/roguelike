export const isoConfig = {
  tileW: 64,
  tileH: 32
};

export function gridToScreen(x, y, z = 0, originX = 0, originY = 0, cfg = isoConfig) {
  const { tileW, tileH } = cfg;
  const zPx = z * tileH;
  const screenX = originX + (x - y) * (tileW / 2);
  const screenY = originY + (x + y) * (tileH / 2) - zPx;
  return { x: screenX, y: screenY };
}

export function screenToGrid(screenX, screenY, originX = 0, originY = 0, cfg = isoConfig) {
  const { tileW, tileH } = cfg;
  const xPrime = screenX - originX;
  const yPrime = screenY - originY;
  const gx = Math.floor((xPrime / (tileW / 2) + yPrime / (tileH / 2)) / 2);
  const gy = Math.floor((yPrime / (tileH / 2) - xPrime / (tileW / 2)) / 2);
  return { x: gx, y: gy };
}
