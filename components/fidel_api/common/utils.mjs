import crypto from "crypto";

export const parseObject = (obj) => {
  if (typeof obj === "string") {
    return JSON.parse(obj);
  }
  return obj;
};

export const secureCompare = (fidelHeaders, payload, secret, url) => {
  const base64Digest = (s) => {
    return crypto.createHmac("sha256", secret).update(s)
      .digest("base64");
  };

  const timestamp = fidelHeaders["x-fidel-timestamp"];
  const content = JSON.stringify(payload) + url + timestamp;

  const signature = base64Digest(base64Digest(content));
  return fidelHeaders["x-fidel-signature"] === signature;
};

