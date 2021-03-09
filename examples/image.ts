import Canvas, { loadImage } from '../mod.ts'
import { serve } from "https://deno.land/std@0.89.0/http/server.ts";

const canvas = Canvas.MakeCanvas(200, 200);
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

const img = await loadImage("https://cdn.discordapp.com/emojis/587737413330272291.gif?v=1");
ctx.drawImage(img, 100 - img.width() / 2, 100 - img.height() / 2);

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);

for await (const request of server) {
  request.respond({ status: 200, body: canvas.toBuffer() });
}