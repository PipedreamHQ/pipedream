import {
  createHmac, timingSafeEqual,
} from "node:crypto";
import { ConfigurationError } from "@pipedream/platform";

export const parseJson = (value, label) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError(`**${label}** must be valid JSON.`);
  }
};

export const firstHeader = (headers = {}, name) => {
  const key = Object.keys(headers).find((header) => header.toLowerCase() === name);
  const value = key
    ? headers[key]
    : undefined;
  return Array.isArray(value)
    ? value[0]
    : value;
};

export const computeSignature = (secret, timestamp, rawBody) => createHmac("sha256", secret)
  .update(`${timestamp}.${rawBody}`)
  .digest("hex");

export const isValidSignature = ({
  secret, timestamp, signature, rawBody, toleranceSeconds,
}) => {
  if (!secret || !timestamp || !signature || typeof rawBody !== "string") {
    return false;
  }
  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) {
    return false;
  }
  if (toleranceSeconds && Math.abs(Math.floor(Date.now() / 1000) - sentAt) > toleranceSeconds) {
    return false;
  }
  const expected = Buffer.from(computeSignature(secret, timestamp, rawBody), "utf8");
  const received = Buffer.from(String(signature).trim()
    .toLowerCase(), "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
};

export const tagLabel = (tag) => [
  tag.emoji,
  tag.text,
].filter(Boolean).join(" ") || tag.id;
