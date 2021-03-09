import { encode } from "https://deno.land/std/encoding/base64.ts";

Deno.writeTextFileSync("wasm.js", `export const WASM_BASE64 = "${encode(Deno.readFileSync("canvaskit.wasm"))}";`);