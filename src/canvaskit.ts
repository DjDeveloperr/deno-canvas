/**
 * Purpose of this is to expose raw CanvasKit with manual initialization
 * to only load WASM when needed.
 */
import * as lib from "./lib.js";
import { CanvasKit } from "./types.ts";

async function init(options?: any): Promise<CanvasKit> {
  return await lib.CanvasKitInit(options ?? {});
}

export { init };
export default init;
export * from "./types.ts";
