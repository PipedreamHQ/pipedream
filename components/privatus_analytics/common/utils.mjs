import { ConfigurationError } from "@pipedream/platform";

const blank = (value) =>
  value === undefined
  || value === null
  || value === ""
  || (Array.isArray(value) && value.length === 0);

/** Drops undefined, null, empty strings and empty lists. False and 0 stay. */
function compact(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([
    , value,
  ]) => !blank(value)));
}

/** JSON text (or a value that is already parsed) from a prop. */
function parseJson(value, name = "Value") {
  if (blank(value)) return undefined;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new ConfigurationError(`**${name}** must be valid JSON`);
  }
}

/** A list from a list prop, where an entry can hold several values separated by commas. */
function toList(value) {
  if (blank(value)) return undefined;
  const list = Array.isArray(value)
    ? value
    : [
      value,
    ];
  const parts = list.flatMap((entry) => String(entry).split(","))
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length
    ? parts
    : undefined;
}

function toNumber(value) {
  if (blank(value)) return undefined;
  const number = Number(value);
  if (Number.isNaN(number)) throw new ConfigurationError(`"${value}" is not a number`);
  return number;
}

/** Accepts a date or a date and time and returns YYYY-MM-DD. */
function toDate(value) {
  if (blank(value)) return undefined;
  const text = String(value).trim();
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  if (match) return match[1];
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    throw new ConfigurationError(`"${value}" is not a date. Use \`YYYY-MM-DD\``);
  }
  return date.toISOString().slice(0, 10);
}

/** Accepts a date or a date and time and returns YYYY-MM. */
function toMonth(value) {
  if (blank(value)) return undefined;
  const text = String(value).trim();
  if (/^\d{4}-\d{2}$/.test(text)) return text;
  return toDate(text).slice(0, 7);
}

/** "https://www.Example.com/x" becomes "example.com". */
function normalizeDomain(input) {
  let text = String(input ?? "").trim()
    .toLowerCase();
  text = text
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, "")
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, "")
    .replace(/\.+$/, "");
  if (text.startsWith("www.") && text.split(".").length > 2) text = text.slice(4);
  return text;
}

/**
 * A query string. A list of plain values goes as `status[]=a&status[]=b`, the
 * way the API reads it, and filters go as JSON.
 */
function queryString(params = {}) {
  const enc = encodeURIComponent;
  const parts = [];
  for (const [
    key,
    value,
  ] of Object.entries(compact(params))) {
    if (Array.isArray(value) && key !== "filters" && value.every((v) => typeof v !== "object")) {
      value.forEach((v) => parts.push(`${enc(key)}[]=${enc(String(v))}`));
    } else if (typeof value === "object") {
      parts.push(`${enc(key)}=${enc(JSON.stringify(value))}`);
    } else {
      parts.push(`${enc(key)}=${enc(String(value))}`);
    }
  }
  return parts.join("&");
}

/** A path segment, escaped. A colon stays (a report of prop:plan is routed only that way). */
function segment(value) {
  return encodeURIComponent(String(value).trim())
    .replace(/%3A/gi, ":");
}

/**
 * Only a path on the API host is accepted, so the token is never sent anywhere
 * else. "/sites/pa_X/goals" becomes "/sites/pa_X/goals.json".
 */
function apiPath(raw) {
  let path = String(raw ?? "").trim();
  if (/^https?:\/\//i.test(path)) path = path.replace(/^https?:\/\/[^/]+/i, "");
  if (!path.startsWith("/") || path.startsWith("//") || /[\s\\]/.test(path) || path.split("/").includes("..")) {
    throw new ConfigurationError("**Path** must be a path like `/sites/pa_7Q2K9XH3AB/goals.json`");
  }
  const [
    base,
    query,
  ] = path.split("?");
  const withJson = base.endsWith(".json")
    ? base
    : `${base.replace(/\/$/, "")}.json`;
  return query
    ? `${withJson}?${query}`
    : withJson;
}

/** The label of a site in a list of options. */
function siteLabel(site) {
  return site.name && site.name !== site.domain
    ? `${site.name} (${site.domain})`
    : site.domain;
}

/** The label of an item that has a status, like an uptime check or an experiment. */
function withStatus(item) {
  return `${item.name} (${item.status})`;
}

/** The label of a testimonial in a list of options: the person and the first words. */
function testimonialLabel(testimonial) {
  const who = testimonial.person?.name || "Unknown";
  const words = String(testimonial.body || testimonial.title || "").replace(/\s+/g, " ")
    .trim();
  const short = words.length > 60
    ? `${words.slice(0, 57)}...`
    : words;
  return `${who}: ${short} (${testimonial.status})`;
}

export default {
  blank,
  compact,
  parseJson,
  toList,
  toNumber,
  toDate,
  toMonth,
  normalizeDomain,
  queryString,
  segment,
  apiPath,
  siteLabel,
  withStatus,
  testimonialLabel,
};
