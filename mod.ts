import * as lib from "./lib.js";
import { CanvasKit } from "./types.ts";

const Canvas = await lib.CanvasKitInit({}) as CanvasKit;

export * from "./types.ts"
export * from "./utils.ts"
export default Canvas