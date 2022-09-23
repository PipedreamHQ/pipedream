import { ConfigurationError } from "@pipedream/platform";

const formatArrayStrings = (objectArray: string[], ALLOWED_KEYS: string[], fieldName: string): string[] => {
  const updatedArray : string[] = [];
  const errors : string[]  = [];
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

const formatString = (key: string, ALLOWED_KEYS: string[]): string => {

  if (!ALLOWED_KEYS.includes(key)) {
    return `${key} error: ${key} not present or allowed in object`;
  }

  return key;
};

export {
  formatArrayStrings, formatString,
};
