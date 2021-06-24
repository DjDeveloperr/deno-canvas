import init from "./src/canvaskit.ts";
import { decodeBase64 } from "./src/base64.ts";

const canvas = await init();

export function dataURLtoFile(dataurl: string) {
  let arr: string[] = dataurl.split(",");
  return decodeBase64(arr[1]);
}

export async function loadImage(url: string | Uint8Array) {
  let data;

  if (url instanceof Uint8Array) {
    data = url;
  } else if (url.startsWith("http")) {
    data = await fetch(url).then((e) => e.arrayBuffer()).then((e) =>
      new Uint8Array(e)
    );
  } else {
    data = await Deno.readFile(url);
  }

  const img = canvas.MakeImageFromEncoded(data);
  if (!img) throw new Error("Invalid image data");

  return img;
}

export const createCanvas = canvas.MakeCanvas;

export * from "./src/types.ts";
export default canvas;
export * from "./src/base64.ts";
