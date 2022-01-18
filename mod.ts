import { init } from "./src/canvas.ts";

const canvas = await init();

export { canvas };
export default canvas;
export * from "./src/canvas.ts";
