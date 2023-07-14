import crypto from "crypto";
import { USER_FIELDS_WITH_HASH } from "./constants";

function getHash(value: string) {
  return crypto.createHash("sha256").update(value)
    .digest("hex");
}

export function checkUserDataObject(obj: object) {
  const cryptoRegexp = /[0-9a-f]{64}/i;
  USER_FIELDS_WITH_HASH.forEach((field) => {
    if (obj[field] && !cryptoRegexp.test(obj[field])) {
      obj[field] = getHash(obj[field]);
    }
  });
  return obj;
}
