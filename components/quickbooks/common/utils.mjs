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

  // Validate detailType values if provided
  const validDetailTypes = [
    "ItemBasedExpenseLineDetail",
    "AccountBasedExpenseLineDetail",
  ];
  const invalidDetailTypes = [];
  for (let i = 1; i <= numLineItems; i++) {
    const detailType = context[`detailType_${i}`];
    if (detailType && !validDetailTypes.includes(detailType)) {
      invalidDetailTypes.push(`detailType_${i}: ${detailType}`);
    }
  }

  if (invalidDetailTypes.length > 0) {
    throw new ConfigurationError(`Invalid detailType values for: ${invalidDetailTypes.join(", ")}. Valid types are: ${validDetailTypes.join(", ")}`);
  }

  const lineItems = [];
  for (let i = 1; i <= numLineItems; i++) {
    const detailType = context[`detailType_${i}`] || "ItemBasedExpenseLineDetail";

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
