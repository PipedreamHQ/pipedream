export function parseObject(obj) {
  if (!obj) return undefined;

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (err) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }
  }

  return obj;
}

export function sanitizeString(str) {
  if (typeof str !== "string") return str;

  // Remove any potential script tags or dangerous content
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}
