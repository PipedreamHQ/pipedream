import hmacSha1 from "crypto-js/hmac-sha1.js";
import qs from "qs";

/*
toQueryString generates the stringified params data
which is used to generate the hmacSha1 token and send it in the request
*/
export const toQueryString = (options) => {
  return qs.stringify(options, {
    encoder: (str) => {
      let result = encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) =>
          "%" +
              c
                .charCodeAt(0)
                .toString(16)
                .toUpperCase(),
      );
      return result;
    },
    filter: (key, value) => {
      if (
        (key === "format") ||
            key === "token" ||
            key === "key" ||
            !value
      ) {
        return;
      }
      return value;
    },
    arrayFormat: "repeat",
  });
};

export const generateToken = (queryString, secret) => {
  if (secret) {
    return `${hmacSha1(queryString, secret)}/`;
  }
  return "";
};
