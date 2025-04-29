import {
  MAX_RETRIES,
  INITIAL_BACKOFF_MILLISECONDS,
} from "./constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export const parseOne = (obj) => {
  let parsed;
  try {
    parsed = JSON.parse(obj);
  } catch (e) {
    parsed = obj;
  }
  return parsed;
};

export async function retryWithExponentialBackoff(
  requestFn, retries = MAX_RETRIES, backoff = INITIAL_BACKOFF_MILLISECONDS,
) {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && error.response?.status === 429) {
      console.warn(`Rate limit exceeded. Retrying in ${backoff}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return retryWithExponentialBackoff(requestFn, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export function parseLineItems(arr) {
  if (!arr) {
    return undefined;
  }
  try {
    if (typeof arr === "string") {
      return JSON.parse(arr);
    }
    return arr.map((lineItem) => typeof lineItem === "string"
      ? JSON.parse(lineItem)
      : lineItem);
  } catch (error) {
    throw new ConfigurationError(`We got an error trying to parse the LineItems. Error: ${error}`);
  }
}
