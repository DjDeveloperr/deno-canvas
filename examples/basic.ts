import { createCanvas } from "../mod.ts";

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "hsl(0, 100%, 50%)";
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

await Deno.writeFile("image.png", canvas.toBuffer());
