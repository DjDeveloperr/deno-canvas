import { encode } from "../deps.ts";

Deno.writeTextFileSync(
  Deno.args[0] ?? "./src/wasm.js",
  `import { decodeBase64 } from "./base64.ts";\nexport const WASM_BUFFER = decodeBase64("${
    encode(Deno.readFileSync(Deno.args[1] ?? "./src/canvaskit-opt.wasm"))
  }");`,
);
