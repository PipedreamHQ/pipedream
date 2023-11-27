import crypto from "crypto";

export const parseObject = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return JSON.parse(item);
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};

export const secureCompare = (hash, request, secret) => {
  const compareHash = sha256hash(request, secret);
  return hash === compareHash;
};

const sha256hash = (request, secret) => {
  const hmac = crypto.createHmac("sha256", Buffer.from(secret, "utf-8"));
  const data = hmac.update(Buffer.from(JSON.stringify(request.body), "utf-8"));
  const getHmac = data.digest("hex");
  return `sha256=${getHmac}`;
};
