// Parses a JSON string into an object, and returns any other value unchanged,
// so a prop can take either a JSON object or plain text.
export function parseObject(value) {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
