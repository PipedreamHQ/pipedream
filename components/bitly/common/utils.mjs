import { ConfigurationError } from "@pipedream/platform";

const formatDeepLink = (deeplinks) => {
  const updatedDeepLink = [];
  const deepLinkErrors = [];
  if (deeplinks?.length) {
    for (let i = 0; i < deeplinks.length; i++) {
      if (deeplinks[i]) {
        try {
          const obj = JSON.parse(deeplinks[i]);
          Object.keys(obj).forEach((key) => {
            if (
              ![
                "app_id",
                "app_uri_path",
                "install_url",
                "install_type",
              ].includes(key)
            ) {
              deepLinkErrors.push(
                `deeplinks[${i}] error: ${key} is not present or allowed in object`,
              );
            }
          });
          updatedDeepLink.push(obj);
        } catch (error) {
          throw new Error(`Object is malformed on deeplinks[${i}]`);
        }
      }
    }
  }
  if (deepLinkErrors.length) {
    throw new Error(
      deepLinkErrors.join(",") +
        ". Allowed keys are app_id,app_uri_path,install_url,install_type",
    );
  }
  return updatedDeepLink;
};

const removeNullEntries = (obj) =>
  Object.entries(obj).reduce((acc, [
    key,
    value,
  ]) => {
    const isNotEmpyString = typeof value === "string";
    const isNotEmptyArray = Array.isArray(value) && value.length;
    const isNotEmptyObject =
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length !== 0;
    return value && (isNotEmpyString || isNotEmptyArray || isNotEmptyObject)
      ? {
        ...acc,
        [key]: value,
      }
      : acc;
  }, {});

const formatArrayStrings = (objectArray, ALLOWED_KEYS, fieldName) => {
  const updatedArray = [];
  const errors = [];
  if (Array.isArray(objectArray) && objectArray?.length) {
    for (let i = 0; i < objectArray.length; i++) {
      if (objectArray[i]) {
        try {
          const obj = JSON.parse(objectArray[i]);
          Object.keys(obj).forEach((key) => {
            if (!ALLOWED_KEYS.includes(key)) {
              errors.push(
                `${fieldName}[${i}] error: ${key} is not present or allowed in object`,
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
      errors.join(",") + `. Allowed keys are ${ALLOWED_KEYS.join(",")}`,
    );
  }
  return updatedArray;
};

export {
  formatDeepLink, removeNullEntries, formatArrayStrings,
};
