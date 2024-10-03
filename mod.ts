import { init } from "./src/canvas.ts";
import type { CanvasKit } from "./src/types.ts";

const canvas: CanvasKit = await init();

export { canvas };
export default canvas;
export * from "./src/canvas.ts";
