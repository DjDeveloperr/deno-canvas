import { encode } from "../deps.ts";

Deno.writeTextFileSync(
  "./src/wasm.js",
  `import { decodeBase64 } from "./base64.ts";\nexport const WASM_BUFFER = decodeBase64("${
    encode(Deno.readFileSync("./src/canvaskit-opt.wasm"))
  }");`,
);
