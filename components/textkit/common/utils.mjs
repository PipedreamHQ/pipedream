import {
  createHmac, timingSafeEqual,
} from "crypto";

/**
 * Splits a comma-separated string (or passes an array through) into trimmed,
 * non-empty values. Returns undefined when nothing is left, so the platform's
 * axios drops the field from the request.
 */
export const parseList = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const items = (Array.isArray(value)
    ? value
    : String(value).split(","))
    .map((v) => String(v).trim())
    .filter(Boolean);
  return items.length
    ? items
    : undefined;
};

/**
 * Checks a `textkit-signature` header (`t=<unix>,v1=<hex>[,v1=<hex>]`).
 * v1 = hex HMAC-SHA256(secret, `${t}.${rawBody}`). Two v1 values appear during
 * a secret rotation; either may match. Timestamps more than `toleranceSec`
 * from now are rejected (replay protection).
 * See https://jointextkit.com/docs/webhooks
 */
export const verifySignature = ({
  rawBody, header, secret, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000),
}) => {
  if (!header || !secret || rawBody === undefined || rawBody === null) return false;
  const parts = String(header).split(",")
    .map((p) => {
      const i = p.indexOf("=");
      return [
        p.slice(0, i).trim(),
        p.slice(i + 1).trim(),
      ];
    });
  const t = parts.find(([
    k,
  ]) => k === "t")?.[1];
  const sigs = parts.filter(([
    k,
  ]) => k === "v1").map(([
    , v,
  ]) => v);
  if (!t || !/^\d+$/.test(t) || !sigs.length) return false;
  if (Math.abs(nowSec - Number(t)) > toleranceSec) return false;
  const body = typeof rawBody === "string"
    ? rawBody
    : rawBody.toString("utf8");
  const expected = createHmac("sha256", secret).update(`${t}.${body}`)
    .digest("hex");
  const exp = Buffer.from(expected);
  return sigs.some((v) => {
    const got = Buffer.from(v);
    return got.length === exp.length && timingSafeEqual(got, exp);
  });
};
