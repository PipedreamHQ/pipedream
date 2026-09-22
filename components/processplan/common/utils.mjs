const isPlainObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);

const parseObject = (value) => {
  if (!value) return {};
  if (typeof value === "object") {
    if (!isPlainObject(value)) throw new Error("Expected a plain JSON object");
    return value;
  }
  try {
    const parsed = JSON.parse(value);
    if (!isPlainObject(parsed)) throw new Error("Expected a plain JSON object");
    return parsed;
  } catch {
    throw new Error("Expected a JSON object string, e.g. {\"key\": \"value\"}");
  }
};

export default {
  parseObject,
};
