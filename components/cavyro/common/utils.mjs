import crypto from "crypto";

export const parseObject = (obj) => {
  if (!obj) {
    return undefined;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  return obj;
};

export const buildEventId = (...parts) => {
  const id = parts.join("-");
  return id.length <= 64
    ? id
    : crypto.createHash("sha256").update(id)
      .digest("hex");
};
