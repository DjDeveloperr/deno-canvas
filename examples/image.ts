import { createCanvas, loadImage } from "../mod.ts";

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

const img = await loadImage(
  "https://cdn.discordapp.com/emojis/587737413330272291.gif?v=1",
);
ctx.drawImage(img, 100 - img.width() / 2, 100 - img.height() / 2);

await Deno.writeFile("image.png", canvas.toBuffer());
