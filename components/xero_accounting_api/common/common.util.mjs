import { ConfigurationError } from "@pipedream/platform";

const removeNullEntries = (obj) =>
  Object.entries(obj).reduce(
    (acc, [k, v]) =>
      v &&
      (typeof v === "string" ||
        (Array.isArray(v) && v.length) ||
        (typeof v === "object" &&
          !Array.isArray(v) &&
          Object.keys(v).length !== 0))
        ? { ...acc, [k]: v }
        : acc,
    {}
  );

const formatArrayStrings = (objectArray, ALLOWED_KEYS, fieldName) => {
  const updatedArray = [];
  const errors = [];
  if (objectArray?.length) {
    for (let i = 0; i < objectArray.length; i++) {
      if (objectArray[i]) {
        try {
          const obj = JSON.parse(objectArray[i]);
          Object.keys(obj).forEach((key) => {
            if (!ALLOWED_KEYS.includes(key)) {
              errors.push(
                `${fieldName}[${i}] error: ${key} is not present or allowed in object`
              );
            }
          });
          updatedArray.push(obj);
        } catch (error) {
          throw new ConfigurationError(`Object is malformed on [${i}]`);
        }
      }
    }
  }
  if (errors.length) {
    throw new ConfigurationError(
      errors.join(",") + `. Allowed keys are ${ALLOWED_KEYS.join(",")}`
    );
  }
  return updatedArray;
};

const deleteKeys = (mainObject, keys = []) => {
  return Object.keys(mainObject)
    .filter((key) => !keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = mainObject[key];
      return obj;
    }, {});
};

const isValidDate = (dateString, key) => {
  if (!dateString) return;
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) {
    throw new ConfigurationError(`Invalid Date set for ${key}`);
  }
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) {
    throw new ConfigurationError(`Invalid Date set for ${key}`);
  }
  return d.toISOString().slice(0, 10) === dateString;
};

const formatQueryString = (payload, quoteValue = false) => {
  const str = [];
  Object.keys(payload).forEach((p) => {
    const result = Array.isArray(payload[p])
      ? formatArray(p, payload[p])
      : formatNonArray(p, payload[p], quoteValue);
    result && str.push(result);
  });
  return str.join("&");
};

const formatArray = (key, value) => {
  const str = [];
  if (value.length) {
    for (let i = 0; i < value.length; i++) {
      value[i] &&
        str.push(
          `${encodeURIComponent(key + `[${i}]`)}=${encodeURIComponent(
            value[i]
          )}`
        );
    }
    return str.join("&");
  }
  return null;
};

const formatNonArray = (key, value, quoteValue) =>
  value &&
  `${encodeURIComponent(key)}=${quoteValue ? '"' : ""}${value}${
    quoteValue ? '"' : ""
  }`;

const formatJsonDate = (d) => {
  const pattern = /Date\(([^)]+)\)/;
  const m = pattern.exec(d);
  return m && new Date(parseFloat(m[1])).toLocaleDateString("en-US");
  //  new Date(parseFloat(m[1])).toLocaleDateString("en-US", {
  //     month: "2-digit",
  //     day: "2-digit",
  //     year: "numeric",
  //   })
};

const chainQueryString = (queryString) =>
  queryString && queryString.split("&").join(" AND ");

export {
  removeNullEntries,
  formatArrayStrings,
  deleteKeys,
  isValidDate,
  formatQueryString,
  chainQueryString,
  formatJsonDate,
};
