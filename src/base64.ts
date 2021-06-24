import { decode } from "../deps.ts";

export function decodeBase64(value: string): Uint8Array {
  let res;
  // core is unstable (in sense of actual stability not --unstable)
  // so we'll fallback to pure js impl
  // why use internal op? it's super fast
  try {
    res = (Deno as any).core.opSync("op_base64_decode", value);
  } catch (e) {
    res = decode(value);
  }
  return res;
}
