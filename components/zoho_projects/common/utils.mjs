import retry from "async-retry";
import constants from "./constants.mjs";

function isRetriable(statusCode) {
  return constants.RETRIABLE_STATUS_CODE.includes(statusCode);
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
  withRetries,
};
