// import { createCanvas } from "https://deno.land/x/canvas@v1.2.2/mod.ts";
import { createCanvas } from "../mod.ts";
import { h } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

function App({ color }) {
  return (
    <html>
      <head>
        <title>Color: {color}</title>
        <meta name="theme-color" content={`#${color}`} />
        <meta name="og:title" content={`#${color}`} />
        <meta name="og:description" content={`Maybe RGB here`} />
        <meta name="og:image" content={`/color/${color}`} />
      </head>
      <body></body>
    </html>
  );
}

addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);

  if (url.pathname.startsWith("/color")) {
    const col = url.pathname.slice(6).trim();
    const cvs = createCanvas(100, 100);
    const ctx = cvs.getContext("2d");
    ctx.fillStyle = `#${col}`;
    ctx.fillRect(0, 0, 100, 100);
    evt.respondWith(
      new Response(cvs.toBuffer(), {
        headers: {
          "content-type": "image/png",
        },
      })
    );
  } else {
    evt.respondWith(
      new Response(renderToString(<App color={url.pathname.slice(1)} />), {
        headers: { "content-type": "text/html; charset=utf-8" },
      })
    );
  }
});
