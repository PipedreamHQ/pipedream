import { createReadStream } from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import retry from "async-retry";
import constants from "./constants.mjs";

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

function emptyStrToUndefined(value) {
  const trimmed = typeof(value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function commaSeparatedListToArray(items) {
  return Array.isArray(items)
    ? items
    : emptyStrToUndefined(items)?.split(",")
      .map((item) => item.trim());
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

async function streamIterator(stream) {
  let resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function summaryEnd(count, singular, plural) {
  if (!plural) {
    plural = singular + "s";
  }
  const noun = count === 1 && singular || plural;
  return `${count} ${noun}`;
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

function buildFormData(formData, data, parentKey) {
  if (data && typeof(data) === "object") {
    Object.keys(data)
      .forEach(async (key) => {
        buildFormData(formData, data[key], parentKey && `${parentKey}[${key}]` || key);
      });

  } else if (data && constants.FILE_PROP_NAMES.some((prop) => prop.includes(parentKey))) {
    formData.append(parentKey, createReadStream(data));

  } else if (data) {
    formData.append(parentKey, (data).toString());
  }
}

function getFormData(data) {
  try {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
  } catch (error) {
    console.log("FormData Error", error);
    throw error;
  }
}

function hasMultipartHeader(headers) {
  return headers && headers["Content-Type"].includes("multipart/form-data");
}

function isRetriable(statusCode) {
  return [
    500,
  ].includes(statusCode);
}

async function withRetries(apiCall) {
  return retry(async (bail) => {
    try {
      return await apiCall();
    } catch (err) {
      const statusCode = err?.response?.status;
      if (!isRetriable(statusCode)) {
        return bail(err);
      }
      console.log(`Retrying with temporary error: ${err.message}`);
      throw err;
    }
  }, {
    retries: 3,
  });
}

export default {
  reduceProperties,
  emptyStrToUndefined,
  emptyObjectToUndefined,
  commaSeparatedListToArray,
  parse,
  streamIterator,
  summaryEnd,
  buildFormData,
  getFormData,
  withRetries,
  hasMultipartHeader,
};
