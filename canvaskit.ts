import * as lib from "./lib.js";
import { CanvasKit } from "./types.ts";

async function init(options?: any): Promise<CanvasKit> {
    return await lib.CanvasKitInit(options ?? {});
}

export { init };
export default init;
export * from "./types.ts";