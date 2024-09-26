export function parseAsJSON(value) {
  return typeof value === "string"
    ? JSON.parse(value)
    : value;
}
