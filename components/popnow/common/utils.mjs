import { ConfigurationError } from "@pipedream/platform";
import { TERMINAL_STATES } from "./constants.mjs";

const USD_PATTERN = /^\d+(\.\d{1,9})?$/;

/**
 * Accepts an object, or a JSON string that encodes an object, and returns the object.
 */
export function parseObject(value, label = "Input") {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      throw new ConfigurationError(`${label} must be a valid JSON object: ${err.message}`);
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  }
  throw new ConfigurationError(`${label} must be a JSON object, for example \`{"prompt": "a red fox"}\`.`);
}

/**
 * Converts an exact USD decimal string (up to nine decimal places) to an integer
 * number of nano-dollars, so amounts can be compared without floating point errors.
 */
export function usdToNanos(value, label = "Amount") {
  const text = String(value ?? "").trim();
  if (!USD_PATTERN.test(text)) {
    throw new ConfigurationError(`${label} must be a USD amount such as \`0.25\` (up to nine decimal places), got \`${text}\`.`);
  }
  const [
    whole,
    fraction = "",
  ] = text.split(".");
  return BigInt(whole) * 1000000000n + BigInt(fraction.padEnd(9, "0"));
}

/**
 * True when the task reached a final state and none of its output files are still being copied.
 */
export function isTaskDone(task) {
  if (!task || !TERMINAL_STATES.includes(task.state)) {
    return false;
  }
  const assets = task.output?.assets ?? [];
  return !assets.some((asset) => asset.pending && !asset.unavailable);
}

/**
 * Removes keys whose value is undefined, null or an empty string.
 */
export function cleanObject(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).filter(([
      , value,
    ]) => value !== undefined && value !== null && value !== ""),
  );
}
