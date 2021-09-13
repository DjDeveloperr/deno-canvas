import { createCanvas, loadImage } from "../mod.ts";

const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 200 - 20, 200 - 20);

const img = await loadImage(
  "https://cdn.discordapp.com/emojis/587737413330272291.gif?v=1",
);
ctx.drawImage(img, 100 - img.width() / 2, 100 - img.height() / 2);

const img2 = await loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAC8UlEQVRIx42V32vVdRjHXx5F3MBld4FWDGXSopoW1brTuwVhRGiwC8HyIhz9wIu6iCQ00uG6UBAJ3am/oNCgWNrCH6PEaDuj5VYzZiPM8ixTtzPa2auLz/f7Pd/za6fnc/F9Ps/n+fV9Ps/7+SyjFrXwHFtpp4NVQIFhxhjkFP/wP2g9WeYR9/i2iPhi+M6TZcPSxs30UgxGm1z0u8hB3omIo0gvzfXMN5IjVvSoekzENS76maUTRtlYy7yDfErJIfWpiN9tJpG/Z6vk6aiOnkcc8ECkeN3f0lGTdcXvRfLlWTSH5LerA5HiicRVWG94w5fFx+0Mkly6Fr1B6WP1/Zpx8Yy6o1zWG5tviCv/g//aVMfBtH9WyoqsDw6yeMUt4m3Ho8M3/cYp77rojJOe9iW/9UJ01uUNDwW+P3TdfJ9F28Rxj4svOG4lLXjWRyIH/erhwBdogW4c8WqS2F7vpgwLTiX8hG0iXnbBB2P9bjiJs34eCZ42Xxb5U/GnZBc6828nS3U4uYL2Hpo4F9XzLe4ta48n+YgHUrt3mOEezpcU2mFuVxKfVMK1acQnPOPz4l4vuVxmiU13etWd3mrgYC4JdclF14mZOJdttLKGOw2wvop9CeqvMQ3AXPA44W3xKxvRl1G++oXIbIZhgNW08jNwkJsNcngIgC5gCGAkw1io/gpywFle49qSDu5nMzDDOPsBxqAbcZc/2iWu9JYfeMScd+r+xNE0HrqhJUzAsA6on0T8Ol9xj39VObhYMi/QEoGpPmgHqhykUJmNb6RYD7SverDGT+xIwTkDTNIXl+h3BlMFO8GxmrfybPj0MVkx0uK13d0J7tbWqMK5qpGWDNW4qaYj3P0iTlSYT7m1aqiWjfX7XPCy2KOeigpboqGKsZ5ggWE6GQV4neWMAo8Cg8BUovIHh3iGX0fpDP1b92k77DaxzXdF3K/OmvPDhk9bfKn9FNIlfdieuG2y8Rwu0bIln/fHaALmGGGMrzld63n/D5IUk9MNidXBAAAAAElFTkSuQmCC')

ctx.drawImage(img2, 0, 0);

await Deno.writeFile("image.png", canvas.toBuffer());
