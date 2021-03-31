import { fetchAuto } from './deps.ts'
import init from "./canvaskit.ts";

const Canvas = await init();

export function dataURLtoFile(dataurl: string) {
    let arr: string[] = dataurl.split(',');
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let data = new Uint8Array(n);
    while(n--){
        data[n] = bstr.charCodeAt(n);
    }
    return data;
}

export async function loadImage(url: string) {
    const base64 = await fetchAuto(url);
    const img = Canvas.MakeImageFromEncoded(dataURLtoFile(base64));
    if(!img) throw new Error("Invalid Image");
    return img;
}

export const createCanvas = Canvas.MakeCanvas;

export * from "./types.ts";
export default Canvas;