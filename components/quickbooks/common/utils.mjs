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

export function parseObject(obj) {
  if (!obj) {
    return undefined;
  }

  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  }

  if (typeof obj === "object") {
    const parsed = {};
    for (const [
      key,
      value,
    ] of Object.entries(obj)) {
      parsed[key] = parseObject(value);
    }
    return parsed;
  }

  return obj;
}

export async function retryWithExponentialBackoff(
  requestFn,
  retries = MAX_RETRIES,
  backoff = INITIAL_BACKOFF_MILLISECONDS,
) {
  try {
    return await requestFn();
  } catch (error) {
    const status = error.response?.status;
    const errorCode = error.response?.data?.Fault?.Error?.[0]?.code;
    const errorCodeStr = errorCode == null
      ? undefined
      : String(errorCode);

    const isRateLimit = status === 429 ||
      status === 503 ||
      errorCodeStr === "3200" || // Rate limit exceeded
      errorCodeStr === "10001";   // Throttle limit exceeded

    if (retries > 0 && isRateLimit) {
      const retryAfter = error.response?.headers?.["retry-after"];
      const delay = retryAfter
        ? parseInt(retryAfter) * 1000
        : backoff;

      console.warn(`QuickBooks rate limit exceeded. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithExponentialBackoff(requestFn, retries - 1, Math.min(backoff * 2, 60000));
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

export function buildSalesLineItems(numLineItems, context) {
  // Validate numLineItems parameter
  if (typeof numLineItems !== "number" || !Number.isInteger(numLineItems) || numLineItems <= 0) {
    throw new ConfigurationError("numLineItems must be a positive integer");
  }

  // Validate context parameter
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new ConfigurationError("context must be an object");
  }

  // Validate required keys exist for each line item
  const missingKeys = [];
  for (let i = 1; i <= numLineItems; i++) {
    if (!Object.prototype.hasOwnProperty.call(context, `amount_${i}`)) {
      missingKeys.push(`amount_${i}`);
    }
    if (!Object.prototype.hasOwnProperty.call(context, `item_${i}`)) {
      missingKeys.push(`item_${i}`);
    }
  }

  if (missingKeys.length > 0) {
    throw new ConfigurationError(`Missing required keys in context: ${missingKeys.join(", ")}`);
  }

  // Validate amount values are valid numbers
  const invalidAmounts = [];
  for (let i = 1; i <= numLineItems; i++) {
    const amount = context[`amount_${i}`];
    if (amount !== undefined && amount !== null && amount !== "" &&
        (typeof amount !== "number" && (typeof amount !== "string" || isNaN(parseFloat(amount))))) {
      invalidAmounts.push(`amount_${i}`);
    }
  }

  if (invalidAmounts.length > 0) {
    throw new ConfigurationError(`Invalid amount values for: ${invalidAmounts.join(", ")}. Amounts must be valid numbers.`);
  }

  const lineItems = [];
  for (let i = 1; i <= numLineItems; i++) {
    lineItems.push({
      DetailType: "SalesItemLineDetail",
      Amount: context[`amount_${i}`],
      SalesItemLineDetail: {
        ItemRef: {
          value: context[`item_${i}`],
        },
      },
    });
  }
  return lineItems;
}

export function buildPurchaseLineItems(numLineItems, context) {
  // Validate numLineItems parameter
  if (typeof numLineItems !== "number" || !Number.isInteger(numLineItems) || numLineItems <= 0) {
    throw new ConfigurationError("numLineItems must be a positive integer");
  }

  // Validate context parameter
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new ConfigurationError("context must be an object");
  }

  // Validate required keys exist for each line item
  const missingKeys = [];
  for (let i = 1; i <= numLineItems; i++) {
    if (!Object.prototype.hasOwnProperty.call(context, `amount_${i}`)) {
      missingKeys.push(`amount_${i}`);
    }
    if (!Object.prototype.hasOwnProperty.call(context, `item_${i}`)) {
      missingKeys.push(`item_${i}`);
    }
  }

  if (missingKeys.length > 0) {
    throw new ConfigurationError(`Missing required keys in context: ${missingKeys.join(", ")}`);
  }

  // Validate amount values are valid numbers
  const invalidAmounts = [];
  for (let i = 1; i <= numLineItems; i++) {
    const amount = context[`amount_${i}`];
    if (amount !== undefined && amount !== null && amount !== "" &&
        (typeof amount !== "number" && (typeof amount !== "string" || isNaN(parseFloat(amount))))) {
      invalidAmounts.push(`amount_${i}`);
    }
  }

  if (invalidAmounts.length > 0) {
    throw new ConfigurationError(`Invalid amount values for: ${invalidAmounts.join(", ")}. Amounts must be valid numbers.`);
  }

  const lineItems = [];
  for (let i = 1; i <= numLineItems; i++) {
    const detailType = "ItemBasedExpenseLineDetail";

    // Extract conditional logic into clear variables
    const isItemBased = detailType === "ItemBasedExpenseLineDetail";
    const detailPropertyName = isItemBased
      ? "ItemBasedExpenseLineDetail"
      : "AccountBasedExpenseLineDetail";
    const refPropertyName = isItemBased
      ? "ItemRef"
      : "AccountRef";

    // Build line item with clearer structure
    const lineItem = {
      DetailType: detailType,
      Amount: context[`amount_${i}`],
      [detailPropertyName]: {
        [refPropertyName]: {
          value: context[`item_${i}`],
        },
        Qty: context[`quantity_${i}`],
      },
    };

    lineItems.push(lineItem);
  }
  return lineItems;
}

export function commaSeparateArray(arr) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr.join(",");
  }
  return arr;
}

export function booleanToString(bool) {
  return bool === true || bool === "true"
    ? "true"
    : "false";
}
