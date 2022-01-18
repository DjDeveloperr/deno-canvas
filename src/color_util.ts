function cap(num: number, min: number, max: number) {
  return num < min ? min : num > max ? max : num;
}

function hueToRgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

// https://stackoverflow.com/a/9493060/12101923
export function hslToRgb(h: number, s: number, l: number) {
  // Convert to 0-1 range
  h = cap(h, 0, 360) / 360;
  s = cap(s, 0, 100) / 100;
  l = cap(l, 0, 100) / 100;

  let r, g, b;

  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function maybeHSL(k: string) {
  if (typeof k === "string") {
    const match = k.match(/^hsla?\((\d+), *(\d+)%, *(\d+)%(, *([\d\.]+))?\)$/);

    if (match !== null) {
      const h = Number(match[1]);
      const s = Number(match[2]);
      const l = Number(match[3]);
      const a = k.startsWith("hsla") && match[5] ? Number(match[5]) : undefined;

      k = "rgb";
      if (a !== undefined) {
        k += "a";
      }
      k += "(";

      const [r, g, b] = hslToRgb(h, s, l);
      k += r + ", ";
      k += g + ", ";
      k += b;

      if (a !== undefined) {
        k += ", " + a;
      }

      k += ")";
    }
  }

  return k;
}
