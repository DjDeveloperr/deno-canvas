# deno-canvas

Canvas API for Deno, ported from
[canvaskit-wasm (Skia)](https://github.com/google/skia/tree/main/modules/canvaskit).

## Installation

Import from https://deno.land/x/canvas/mod.ts or just import from raw GitHub
URL, https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/mod.ts.

## Usage

`mod.ts` provides a default export exposing the complete CanvasKit API, and
other exports from the file are types and utility functions.

```ts
import { createCanvas } from "https://deno.land/x/canvas/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

await Deno.writeFile("image.png", canvas.toBuffer());
```

And run with `deno run --allow-write filename.ts`.

You can also try this HTTP server example,
https://raw.githubusercontent.com/DjDeveloperr/deno-canvas/master/examples/square.ts

For using images, use `loadImage` method exported from `mod.ts`.

```ts
const image = await loadImage(myURL);
ctx.drawImage(image, x, y);
```

## Limitations

[Just like original canvaskit-wasm, the emulated Canvas has some limitations:](https://github.com/google/skia/tree/main/modules/canvaskit/npm_build#known-issues-with-canvas2d-emulation-layer)

- measureText returns width only and does no shaping. It is only sort of valid
  with ASCII letters.
- textAlign is not supported.
- textBaseAlign is not supported.
- fillText does not support the width parameter.

## License

Check [LICENSE](./LICENSE) for more info.

Copyright 2022 © DjDeveloperr
