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

const formatArrayObjects = (objectArray, ALLOWED_KEYS) => {
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
                `[${i}] error: ${key} is not present or allowed in object`
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

export { removeNullEntries, formatArrayObjects, deleteKeys, isValidDate };
