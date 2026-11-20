import { createHash } from "crypto";
import {
  CUSTOM_ATTRIBUTES_KEY, PRODUCT_ATTRIBUTES_KEY,
} from "./constants.mjs";

export function parseJson(value) {
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function parseObjectValues(obj) {
  return Object.fromEntries(Object.entries(obj ?? {}).map(([
    key,
    value,
  ]) => [
    key,
    parseJson(value),
  ]));
}

export function buildProductIdentifier({
  legacyLocal, contentLanguage, feedLabel, offerId,
}) {
  return [
    legacyLocal && "local",
    contentLanguage,
    feedLabel,
    offerId,
  ].filter(Boolean).join("~");
}

// Accepts `en~US~sku`, a base64url ID, or a legacy Content API ID (`online:en:US:sku`)
export function encodeProductId(productId) {
  let id = productId.trim();
  const legacy = id.match(/^(online|local):([^:]+):([^:]+):(.+)$/);
  if (legacy) {
    const [
      , channel,
      contentLanguage,
      feedLabel,
      offerId,
    ] = legacy;
    id = buildProductIdentifier({
      legacyLocal: channel === "local",
      contentLanguage,
      feedLabel,
      offerId,
    });
  }
  if (!id.includes("~")) {
    return id;
  }
  return Buffer.from(id).toString("base64url");
}

export function toDataSourceName(dataSourceId, merchantId) {
  const id = dataSourceId.trim();
  return id.startsWith("accounts/")
    ? id
    : `accounts/${merchantId}/dataSources/${id}`;
}

export function buildProductInputBody(attributes) {
  const {
    [CUSTOM_ATTRIBUTES_KEY]: customAttributes, ...productAttributes
  } = attributes ?? {};
  // Some clients JSON-parse object values; top-level numeric attributes are strings or int64
  for (const [
    key,
    value,
  ] of Object.entries(productAttributes)) {
    if (typeof value === "number") {
      productAttributes[key] = String(value);
    }
  }
  return {
    [PRODUCT_ATTRIBUTES_KEY]: productAttributes,
    ...(customAttributes && {
      [CUSTOM_ATTRIBUTES_KEY]: customAttributes,
    }),
  };
}

export function toUpdateMask(fields) {
  const mask = fields
    ?.map((field) => field.trim())
    .filter(Boolean)
    .map((field) => (field.startsWith(`${PRODUCT_ATTRIBUTES_KEY}.`)
      || field.startsWith(`${CUSTOM_ATTRIBUTES_KEY}.`)
      ? field
      : `${PRODUCT_ATTRIBUTES_KEY}.${field}`))
    .join(",");
  return mask || undefined;
}

export function hashId(value) {
  return createHash("sha256").update(value)
    .digest("hex");
}
