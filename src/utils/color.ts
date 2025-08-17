export function normalizeHex(input: string): string | null {
  const s = input.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(s)) return '#' + s.split('').map(c => c + c).join('').toUpperCase()
  if (/^[0-9a-fA-F]{6}$/.test(s)) return '#' + s.toUpperCase()
  return null
}

export function hexToRgb(hex: string) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function brightness({ r, g, b }: { r: number; g: number; b: number }) {
  // perceptual brightness
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
}

export function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)) }

// sRGB -> XYZ -> Lab -> CIE76
function srgbToLinear(c: number) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
export function rgbToXyz({ r, g, b }: { r: number; g: number; b: number }) {
  const R = srgbToLinear(r / 255), G = srgbToLinear(g / 255), B = srgbToLinear(b / 255)
  return {
    x: R * 0.4124 + G * 0.3576 + B * 0.1805,
    y: R * 0.2126 + G * 0.7152 + B * 0.0722,
    z: R * 0.0193 + G * 0.1192 + B * 0.9505,
  }
}
export function xyzToLab({ x, y, z }: { x: number; y: number; z: number }) {
  const ref = { x: 0.95047, y: 1.0, z: 1.08883 }
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)
  const fx = f(x / ref.x), fy = f(y / ref.y), fz = f(z / ref.z)
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) }
}
export function deltaE76(l1: { L: number; a: number; b: number }, l2: { L: number; a: number; b: number }) {
  const dL = l1.L - l2.L, da = l1.a - l2.a, db = l1.b - l2.b
  return Math.sqrt(dL * dL + da * da + db * db)
}
