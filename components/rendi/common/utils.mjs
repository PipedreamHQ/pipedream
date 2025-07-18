export function parseObject(obj) {
  if (!obj) return undefined;

  if (typeof obj === "string") {
    return JSON.parse(obj);
  }

  return obj;
}
