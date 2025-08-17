import { Guild } from "../interfaces/api/athena/Guild";
import { createCanvas, loadImage, registerFont } from "canvas";
import { hexToRgb, brightness, rgbToXyz, xyzToLab, deltaE76, clamp } from "./color";
import path from "path";

export const MIN_BRIGHTNESS = 60; //-- 0..255
export const MIN_DELTA_E = 20; //-- CIE76 distance
const TERRITORY_BG = path.resolve(process.cwd(), 'assets', 'detlas.png')
const TERRITORY_FONT_PATH = path.resolve(process.cwd(), "assets", "Savior.ttf");

let FONT_FAMILY = "Sans-Serif";
try {
  registerFont(TERRITORY_FONT_PATH, { family: "GuildPreview" });
  FONT_FAMILY = "GuildPreview";
} catch {
  // fallback silently to system font if the file isn't present
}

export function findClosest(targetHex: string, palette: Guild[]) {
  const rgbT = hexToRgb(targetHex)!;
  const labT = xyzToLab(rgbToXyz(rgbT));
  let closest: Guild | null = null;
  let distance = Number.POSITIVE_INFINITY;
  for (const gc of palette) {
    const rgb = hexToRgb(gc.color);
    if (!rgb) continue;
    const d = deltaE76(labT, xyzToLab(rgbToXyz(rgb)));
    if (d < distance) {
      distance = d;
      closest = gc;
    }
  }
  return { closest, distance };
}

export function isAllowed(hex: string, palette: Guild[]) {
  const rgb = hexToRgb(hex)!;
  const brightOk = brightness(rgb) >= MIN_BRIGHTNESS;
  const { distance } = findClosest(hex, palette);
  const uniqueEnough = Number.isFinite(distance)
    ? distance >= MIN_DELTA_E
    : true;
  return { allowed: brightOk && uniqueEnough, distance };
}

export async function buildTerritoryPanelImage(opts: {
  colorHex: string
  prefix: string
  panelSize?: number
  borderWidth?: number
  alpha?: number
}): Promise<Buffer> {
  const bgPath = TERRITORY_BG
  const img = await loadImage(bgPath)
  const W = img.width, H = img.height

  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  // draw background
  ctx.drawImage(img, 0, 0, W, H)

  const panelSize = clamp(opts.panelSize ?? 0.8, 0.2, 0.95)
  const side = Math.round(Math.min(W, H) * panelSize)
  const x = Math.round((W - side) / 2)
  const y = Math.round((H - side) / 2)

  const rgb = hexToRgb(opts.colorHex) ?? { r: 255, g: 255, b: 255 }
  const alpha = opts.alpha ?? 0.35
  const border = opts.borderWidth ?? 6

  ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
  ctx.fillRect(x, y, side, side)

  ctx.lineWidth = border
  ctx.strokeStyle = opts.colorHex
  const half = border / 2
  ctx.strokeRect(x + half, y + half, side - border, side - border)

  const tag = (opts.prefix || 'TAG').toUpperCase().slice(0, 8)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const fontSize = 32;
  ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;

  ctx.lineJoin = 'round'
  ctx.strokeStyle = 'rgba(0,0,0,0.95)'
  ctx.lineWidth = Math.max(6, Math.round(fontSize * 0.12))
  ctx.strokeText(tag, x + side / 2, y + side / 2)
  ctx.fillStyle = opts.colorHex
  ctx.fillText(tag, x + side / 2, y + side / 2)

  return canvas.toBuffer('image/png')
}