import { ConfigurationError } from "@pipedream/platform";

function emptyStrToUndefined(value) {
  const trimmed = typeof (value) === "string" && value.trim();
  return trimmed === ""
    ? undefined
    : value;
}

function parse(value) {
  const valueToParse = emptyStrToUndefined(value);
  if (typeof (valueToParse) === "object" || valueToParse === undefined) {
    return valueToParse;
  }
  try {
    return JSON.parse(valueToParse);
  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid object");
  }
}

function parseArray(value) {
  try {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error("Not an array");
    }

    return parsedValue;

  } catch (e) {
    throw new ConfigurationError("Make sure the custom expression contains a valid array object");
  }
}

function parseObject(obj) {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

// Gong sentence offsets are ms from call start, not wall-clock
function millisToTimestamp(millis) {
  const totalSeconds = Number.isFinite(millis)
    ? Math.floor(millis / 1000)
    : 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds,
  ]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

function toExposedFields(allowedFields, selectedFields) {
  const selected = new Set(selectedFields || []);
  return Object.fromEntries(allowedFields.map(({ value }) => [
    value,
    selected.has(value),
  ]));
}

function assertKnownValues(label, allowedFields, selectedFields) {
  const allowed = allowedFields.map(({ value }) => value);
  const unknown = (selectedFields || []).filter((value) => !allowed.includes(value));
  if (unknown.length) {
    throw new ConfigurationError(`Unknown \`${label}\` values: ${unknown.join(", ")}. Allowed values: ${allowed.join(", ")}`);
  }
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1
    ? singular
    : plural}`;
}

export default {
  parseArray,
  parseObject,
  parse,
  streamIterator,
  millisToTimestamp,
  toExposedFields,
  assertKnownValues,
  pluralize,
};
