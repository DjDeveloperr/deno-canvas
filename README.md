# deno-canvas

Canvas API for Deno, ported from [canvaskit-wasm (Skia)](https://github.com/google/skia/tree/master/modules/canvaskit). 

## Installation
Import from https://deno.land/x/canvas/mod.ts or just import from raw GitHub URL, https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/mod.ts.

## Usage
`mod.ts` provides a default export exposing the complete CanvasKit API, and other exports from the file are types and util functions.

```ts
import Canvas from 'https://deno.land/x/canvas@v1.1.0/mod.ts'
import { serve } from "https://deno.land/std@0.89.0/http/server.ts";

const canvas = Canvas.MakeCanvas(200, 200);
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

for await (const request of server) {
  request.respond({ status: 200, body: canvas.toBuffer() });
}
```

And run with `deno run --allow-net filename.ts`.
Or you can directly run from URL, https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/examples/square.ts

For using images, use `loadImage` method exported from `mod.ts`.
```ts
const image = await loadImage(myURL);
ctx.drawImage(image, x, y);
```
