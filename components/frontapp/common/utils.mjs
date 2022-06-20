import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof(valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

function emptyObjectToUndefined(value) {
  if (typeof(value) !== "object" || Array.isArray(value)) {
    return value;
  }

  if (!Object.keys(value).length) {
    return undefined;
  }

  const reduction = Object.entries(value)
    .reduce((reduction, [
      key,
      value,
    ]) => {
      if (!emptyStrToUndefined(value)) {
        return reduction;
      }
      return {
        ...reduction,
        [key]: value,
      };
    }, {});

  return Object.keys(reduction).length
    ? reduction
    : undefined;
}

function addProperty({
  src, validation, addition,
}) {
  return validation
    ? {
      ...src,
      ...addition,
    }
    : src;
}

function reduceProperties({
  initialProps = {}, additionalProps = {},
}) {
  return Object.keys(additionalProps)
    .reduce((src, key) => {
      const context = additionalProps[key];
      const isArrayContext = Array.isArray(context);

      return addProperty({
        src,
        validation: isArrayContext
          ? context[1]
          : context,
        addition: {
          [key]: isArrayContext
            ? context[0]
            : context,
        },
      });
    }, initialProps);
}

function buildFormData(formData, data, parentKey) {
  if (data && typeof data === "object") {
    Object.keys(data)
      .forEach((key) => {
        buildFormData(formData, data[key], parentKey && `${parentKey}[${key}]` || key);
      });
  } else {
    formData.append(parentKey, data);
  }
}

function getFormData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

export default {
  emptyStrToUndefined,
  emptyObjectToUndefined,
  parse,
  reduceProperties,
  getFormData,
};
