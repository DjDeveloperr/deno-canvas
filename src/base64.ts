import { decode, encode } from "../deps.ts";

// core is unstable (in sense of actual stability not --unstable)
// so we'll fallback to pure js impl
// why use internal op? it's super fast

export function decodeBase64(value: string): Uint8Array {
  let res;
  try {
    res = (Deno as any).core.opSync("op_base64_decode", value);
  } catch (e) {
    res = decode(value);
  }
  return res;
}

export function encodeBase64(value: Uint8Array): string {
  let res;
  try {
    res = (Deno as any).core.opSync("op_base64_encode", value);
  } catch (e) {
    res = encode(value);
  }
  return res;
}
