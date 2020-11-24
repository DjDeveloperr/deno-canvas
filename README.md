# deno-canvas

Canvas API for Deno, ported from [canvaskit-wasm (Skia)](https://github.com/google/skia/tree/master/modules/canvaskit). 

## Installation
Import from https://deno.land/x/canvas@v1.0.0/mod.ts or just import from raw GitHub URL, https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/mod.ts.

## Note
The WASM file is like 6mb in size, when you import it first time and "canvaskit.wasm" is not present in the current dir, this module will download it and attempt to save. It's better to have it locally or at least give app `--allow-write` permission to avoid downloading it all again, on every import. You may also download the file [here](https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/canvaskit.wasm) from the repo and save it manually.

## Usage
`mod.ts` provides a default export exposing the complete CanvasKit API, and other exports from the file are types and util functions.

```ts
import Canvas, { CanvasRenderingContext2D, dataURLtoFile } from 'https://deno.land/x/canvas@v1.0.0/mod.ts'
import { serve } from "https://deno.land/std@0.78.0/http/server.ts";

const canvas = Canvas.MakeCanvas(200, 200);
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

const data = dataURLtoFile(canvas.toDataURL());

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

for await (const request of server) {
  request.respond({ status: 200, body: data });
}
```

And for using images, always use `loadImage` method exported from `mod.ts`!
```ts
const image = await loadImage(myURL);
ctx.drawImage(image, x, y);
```

And run with `deno run --allow-net --allow-read filename.ts`!
Or you can directly run from URL, https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/examples/square.ts