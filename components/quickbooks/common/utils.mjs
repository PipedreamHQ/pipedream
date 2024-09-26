import {
  MAX_RETRIES,
  INITIAL_BACKOFF_MILLISECONDS,
} from "./constants.mjs";

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
