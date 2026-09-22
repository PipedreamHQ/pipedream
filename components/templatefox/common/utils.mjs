export function parseObject(value) {
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    return JSON.parse(trimmed);
  }
  return value;
}
