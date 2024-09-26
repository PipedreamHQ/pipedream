import crypto from "crypto";

export const secureCompare = (hash, request, secret) => {
  const compareHash = sha256hash(request, secret);
  return hash === compareHash;
};

const sha256hash = (request, secret) => {
  const hmac = crypto.createHmac("sha256", Buffer.from(secret, "utf-8"));
  const data = hmac.update(Buffer.from(request, "utf-8"));
  const getHmac = data.digest("hex");
  return getHmac;
};

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

export const convertTime = (time) => {
  const splitedTime = time.split(":");
  return (splitedTime.length === 2)
    ? (parseInt(splitedTime[0]) * 60) + parseInt(splitedTime[1])
    : false;
};
