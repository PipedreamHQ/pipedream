const STOCK_SOURCES = new Set([
  "reddit",
  "x",
  "news",
  "polymarket",
]);
const ASSET_TYPES = new Set([
  "stock",
  "crypto",
]);
const STOCK_PATTERN = /^\$?(?=.{1,20}$)(?:[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)?)$/;
const CRYPTO_PATTERN = /^\$?[A-Za-z0-9]{1,20}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function normalizeDate(value, name) {
  if (value == null || value === "") {
    return undefined;
  }
  const normalized = String(value).trim();
  const date = new Date(`${normalized}T00:00:00Z`);
  if (
    !DATE_PATTERN.test(normalized)
    || Number.isNaN(date.getTime())
    || date.toISOString().slice(0, 10) !== normalized
  ) {
    throw new Error(`${name} must use YYYY-MM-DD format`);
  }
  return normalized;
}
export function buildWindow(fromDate, toDate) {
  const from = normalizeDate(fromDate, "From Date");
  const to = normalizeDate(toDate, "To Date");
  if (from && to && from > to) {
    throw new Error("From Date must not be after To Date");
  }
  return {
    ...(from && {
      from,
    }),
    ...(to && {
      to,
    }),
  };
}

export function normalizeSource(source) {
  const normalized = String(source ?? "reddit").trim()
    .toLowerCase();
  if (!STOCK_SOURCES.has(normalized)) {
    throw new Error("Stock Source must be Reddit, X, Financial News, or Polymarket");
  }
  return normalized;
}

export function normalizeAssetType(assetType) {
  const normalized = String(assetType ?? "stock").trim()
    .toLowerCase();
  if (!ASSET_TYPES.has(normalized)) {
    throw new Error("Asset Type must be Stock or Crypto");
  }
  return normalized;
}

export function normalizeIdentifier(value, crypto) {
  const normalized = String(value ?? "").trim()
    .toUpperCase();
  const pattern = crypto
    ? CRYPTO_PATTERN
    : STOCK_PATTERN;
  if (!pattern.test(normalized)) {
    throw new Error(`Invalid ${crypto
      ? "crypto symbol"
      : "stock ticker"}`);
  }
  return normalized.replace(/^\$/, "");
}

export function normalizeIdentifiers(values, crypto) {
  const items = Array.isArray(values)
    ? values
    : String(values ?? "").split(",");
  const normalized = [
    ...new Set(items.map((value) => normalizeIdentifier(value, crypto))),
  ];
  if (normalized.length > 10) {
    throw new Error("Compare Assets accepts at most 10 identifiers");
  }
  return normalized;
}

export function normalizeLimit(limit) {
  const normalized = Number(limit ?? 20);
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 100) {
    throw new Error("Limit must be an integer from 1 to 100");
  }
  return normalized;
}
