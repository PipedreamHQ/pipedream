import { nanoid } from "nanoid";

/**
   * This function creates a unique name composed of the component ID and
   * another random ID. The component is included so it's clear to the user
   * which component created the resources. The short ID (the random part) is
   * included because these resources are destroyed and created on component
   * updates, and we hit race conditions trying to delete and re-create a
   * resource with the exact same name.
   *
   * @returns a random string that can be used as a unique name
   */
function generateRandomUniqueName() {
  const { PD_COMPONENT: componentId } = process.env;
  const randomPart = nanoid();
  return `pd-${componentId}-${randomPart}`;
}
/**
   * A utility function that accepts a string as an argument and reformats it in
   * order to remove newline characters and consecutive spaces. Useful when
   * dealing with very long templated strings that are split into multiple lines.
   *
   * @example
   * // returns "This is a much cleaner string"
   * toSingleLineString(`
   *   This is a much
   *   cleaner string
   * `);
   *
   * @param {string}  multiLineString the input string to reformat
   * @returns a formatted string based on the content of the input argument,
   * without newlines and multiple spaces
   */
function toSingleLineString(multiLineString) {
  return multiLineString
    .trim()
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ");
}

function attemptToParseJSON(strObj) {
  switch (strObj) {
  case "":
  case "null":
  case "undefined":
  case null:
  case undefined:
    return undefined;
  }

  try {
    return JSON.parse(strObj);
  } catch (e) {
    throw new Error("JSON input could not be parsed");
  }
}

const parseJson = (input, maxDepth = 100) => {
  const seen = new WeakSet();
  const parse = (value) => {
    if (maxDepth <= 0) {
      return value;
    }
    if (typeof(value) === "string") {
      // Only parse if the string looks like a JSON object or array
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
        (trimmed.startsWith("[") && trimmed.endsWith("]"))
      ) {
        try {
          return parseJson(JSON.parse(value), maxDepth - 1);
        } catch (e) {
          return value;
        }
      }
      return value;
    } else if (typeof(value) === "object" && value !== null && !Array.isArray(value)) {
      if (seen.has(value)) {
        return value;
      }
      seen.add(value);
      return Object.entries(value)
        .reduce((acc, [
          key,
          val,
        ]) => Object.assign(acc, {
          [key]: parse(val),
        }), {});
    } else if (Array.isArray(value)) {
      return value.map((item) => parse(item));
    }
    return value;
  };

  return parse(input);
};

function parseArray (input, maxDepth = 100) {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => parseArray(item, maxDepth - 1));
        }
      } catch (e) {
        throw new Error(`Invalid JSON array format: ${e.message}`);
      }
    }
    return parseJson(input, maxDepth);
  }

  if (Array.isArray(input)) {
    return input.map((item) => parseArray(item, maxDepth));
  }

  return input;
}

/**
 * Runs `worker` over `items` with at most `limit` calls in flight and returns
 * the results in input order. `worker` should handle its own errors. If one
 * still throws, the remaining items are processed anyway and the first error is
 * thrown once all of them have finished, so a failure never leaves part of the
 * list silently unprocessed.
 *
 * @param {Array} items the items to process
 * @param {number} limit the max number of concurrent `worker` calls
 * @param {Function} worker async function invoked as `worker(item, index)`
 * @returns {Promise<Array>} the results, in the same order as `items`
 */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  const errors = [];
  let cursor = 0;
  const runNext = async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        results[index] = await worker(items[index], index);
      } catch (err) {
        errors.push(err);
      }
    }
  };
  await Promise.all(
    Array.from({
      length: Math.min(limit, items.length),
    }, runNext),
  );
  if (errors.length) {
    throw errors[0];
  }
  return results;
}

/**
 * Turns an S3 object key into a relative path that is safe to join onto a
 * directory: keeps the folder structure, drops empty, `.` and `..` segments and
 * control characters, so a key can never point outside that directory.
 *
 * @example
 * // returns "reports/2025/summary.pdf"
 * keyToRelativePath("/reports//2025/../2025/summary.pdf");
 *
 * @param {string} key an S3 object key
 * @returns {string} a relative path, or an empty string when nothing is left
 */
function keyToRelativePath(key) {
  return String(key)
    // eslint-disable-next-line no-control-regex
    .replace(/[\0-\x1f\\]/g, "_")
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
}

export {
  generateRandomUniqueName,
  toSingleLineString,
  attemptToParseJSON,
  parseJson,
  parseArray,
  mapWithConcurrency,
  keyToRelativePath,
};
