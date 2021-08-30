import { createCanvas } from "../mod.ts";

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";
ctx.fillRect(0, 0, 200, 200);

ctx.fillStyle = "white";
ctx.font = "20px sans-serif";
// TODO: Find out why textBaseline, textAlign, etc. is broken
// ctx.textBaseline = "bottom";
ctx.fillText("Hello, World!", 5, 25);

await Deno.writeFile("image.png", canvas.toBuffer());
