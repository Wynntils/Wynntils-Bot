import fetch from "node-fetch";
import sharp from "sharp";
import GIFEncoder from "gif-encoder-2";

export type CapeMeta = {
  width: number;
  height: number;
  frameHeight: number;
  frameCount: number;
}


export type CapeGifOptions = {
  /** Per-frame delay (ms). Default 80 (~12.5 fps) */
  delayMs?: number;
  /** Loop count: 0 = forever. Default 0 */
  loop?: number;
  /** If set and the sheet is wider, downscale to this width before slicing */
  targetWidth?: number;
  /** GIF palette quality (1 best, 30 worst). Default 10 */
  quality?: number;
  /** Max frames to include (safety). Omit for all */
  maxFrames?: number;
  /** Start frame index (0-based). Default 0 */
  startFrame?: number;
};

export async function fetchBuffer(url: string, userAgent = "Wynntils Artemis"): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": userAgent } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

export async function getCapeMeta(buf: Buffer): Promise<CapeMeta> {
  const meta = await sharp(buf).metadata();
  if (!meta.width || !meta.height) throw new Error("Cape image has no dimensions");
  const frameHeight = Math.round(meta.width / 2); // frames are 2:1 (w:h)
  const frameCount = Math.max(1, Math.floor(meta.height / frameHeight));
  return { width: meta.width, height: meta.height, frameHeight, frameCount };
}

export async function getFirstFramePNG(
  buf: Buffer,
  targetWidth?: number
): Promise<{ buffer: Buffer; meta: CapeMeta }> {
  const baseMeta = await getCapeMeta(buf);

  // Optional resize to keep attachments small
  const scale =
    targetWidth && baseMeta.width > targetWidth ? targetWidth / baseMeta.width : 1;

  const outWidth = Math.round(baseMeta.width * scale);
  const outFrameHeight = Math.round(baseMeta.frameHeight * scale);

  const sheet = sharp(buf);
  const resized = scale !== 1 ? sheet.resize({ width: outWidth }) : sheet;

  const firstFramePng = await resized
    .clone()
    .extract({ left: 0, top: 0, width: outWidth, height: outFrameHeight })
    .png()
    .toBuffer();

  return {
    buffer: firstFramePng,
    meta: {
      width: outWidth,
      height: outFrameHeight * baseMeta.frameCount,
      frameHeight: outFrameHeight,
      frameCount: baseMeta.frameCount,
    },
  };
}

export async function buildCapeGif(
  buf: Buffer,
  {
    delayMs = 80,
    loop = 0,
    targetWidth,
    quality = 10,
    maxFrames,
    startFrame = 0,
  }: CapeGifOptions = {}
): Promise<{ buffer: Buffer; meta: CapeMeta }> {
  const baseMeta = await getCapeMeta(buf);

  // Downscale (optional)
  const scale =
    targetWidth && baseMeta.width > targetWidth ? targetWidth / baseMeta.width : 1;
  const outWidth = Math.round(baseMeta.width * scale);
  const outFrameHeight = Math.round(baseMeta.frameHeight * scale);

  const totalFrames = baseMeta.frameCount;
  const endExclusive = Math.min(
    totalFrames,
    maxFrames ? startFrame + maxFrames : totalFrames
  );

  const sheet = sharp(buf);
  const resized = scale !== 1 ? sheet.resize({ width: outWidth }) : sheet;

  // Collect RGBA frames (Uint8ClampedArray)
  const rgbaFrames: Uint8ClampedArray[] = [];
  for (let i = startFrame; i < endExclusive; i++) {
    const top = i * outFrameHeight;
    const { data, info } = await resized
      .clone()
      .extract({ left: 0, top, width: outWidth, height: outFrameHeight })
      .ensureAlpha() // RGBA
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels !== 4) {
      throw new Error(`Expected RGBA (4 channels), got ${info.channels}`);
    }
    rgbaFrames.push(new Uint8ClampedArray(data));
  }

  // Encode GIF
  const enc = new GIFEncoder(outWidth, outFrameHeight);
  enc.setRepeat(loop);
  enc.setDelay(delayMs);
  enc.setQuality(quality);

  const chunks: Buffer[] = [];
  const stream = enc.createReadStream();
  stream.on("data", (c: Buffer) => chunks.push(c));

  enc.start();
  for (const f of rgbaFrames) enc.addFrame(f);
  enc.finish();

  await new Promise<void>((resolve, reject) => {
    stream.on("end", () => resolve());
    stream.on("error", reject);
  });

  return {
    buffer: Buffer.concat(chunks),
    meta: {
      width: outWidth,
      height: outFrameHeight * totalFrames,
      frameHeight: outFrameHeight,
      frameCount: totalFrames,
    },
  };
}