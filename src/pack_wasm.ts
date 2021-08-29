import { encode } from "../deps.ts";

Deno.writeTextFileSync(
  "./src/wasm.js",
  `export const WASM_BASE64 = "${
    encode(Deno.readFileSync("./src/canvaskit.wasm"))
  }";`,
);
