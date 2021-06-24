import { encode } from "https://deno.land/std@0.98.0/encoding/base64.ts";

Deno.writeTextFileSync("wasm.js", `export const WASM_BASE64 = "${encode(Deno.readFileSync("canvaskit-opt.wasm"))}";`);
