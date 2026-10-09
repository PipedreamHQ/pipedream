/**
 * Safely parses a JSON string if it represents a JSON object or array,
 * while preserving primitives and textual identifiers (such as UPC/EAN/ISBN) as strings.
 *
 * @param {*} prop - The value or JSON string to parse.
 * @returns {*} The parsed object/array, or the original value if not valid JSON.
 */
export function parseProp(prop) {
  if (typeof prop === "string") {
    const trimmed = prop.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return prop;
      }
    }
    return prop;
  }
  return prop;
}

/**
 * Parses an input into an array of trimmed non-empty strings.
 * Supports JSON array strings, comma-delimited strings, raw arrays, or single values.
 * Preserves leading zeroes for string identifiers (e.g. UPC, EAN, ISBN).
 *
 * @param {*} prop - The array, comma-delimited string, or JSON string to parse.
 * @returns {string[]} An array of trimmed string elements.
 */
export function parseArray(prop) {
  if (!prop) {
    return [];
  }
  const parsed = parseProp(prop);
  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => (item !== undefined && item !== null ? String(item).trim() : ""))
      .filter(Boolean);
  }
  if (typeof parsed === "string") {
    return parsed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  const str = String(parsed).trim();
  return str
    ? [
      str,
    ]
    : [];
}

/**
 * Normalizes item aspects into the structure expected by eBay Inventory API ({ [key: string]: string[] }).
 *
 * @param {object|string} aspects - Aspects key-value pairs or JSON string.
 * @returns {object|undefined} Normalized aspects object or undefined if empty.
 */
export function formatAspects(aspects) {
  if (!aspects) {
    return undefined;
  }
  const parsed = parseProp(aspects);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return undefined;
  }

  const formatted = {};
  for (const [
    key,
    val,
  ] of Object.entries(parsed)) {
    if (val === undefined || val === null || val === "") {
      continue;
    }
    if (Array.isArray(val)) {
      formatted[key] = val.map((v) => String(v).trim()).filter(Boolean);
    } else {
      formatted[key] = [
        String(val).trim(),
      ];
    }
  }

  return Object.keys(formatted).length > 0
    ? formatted
    : undefined;
}

/**
 * Recursively removes null, undefined, empty strings, and empty objects/arrays from an object.
 *
 * @param {*} obj - The object to clean.
 * @returns {*} The cleaned object or undefined if empty.
 */
export function cleanObject(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    const cleanedArr = obj
      .map(cleanObject)
      .filter((item) => item !== undefined && item !== null && item !== "");
    return cleanedArr.length > 0
      ? cleanedArr
      : undefined;
  }
  const cleanedObj = {};
  for (const [
    key,
    val,
  ] of Object.entries(obj)) {
    if (val === undefined || val === null || val === "") {
      continue;
    }
    const cleanedVal = cleanObject(val);
    if (cleanedVal !== undefined && cleanedVal !== null && cleanedVal !== "") {
      if (typeof cleanedVal === "object" && !Array.isArray(cleanedVal) && Object.keys(cleanedVal).length === 0) {
        continue;
      }
      cleanedObj[key] = cleanedVal;
    }
  }
  return Object.keys(cleanedObj).length > 0
    ? cleanedObj
    : undefined;
}

/**
 * Generates the live listing web URL for an eBay item given its listing ID and marketplace ID.
 *
 * @param {string} listingId - The eBay listing ID.
 * @param {string} [marketplaceId="EBAY_US"] - The eBay marketplace ID.
 * @returns {string} The full web URL to the live listing.
 */
export function getListingUrl(listingId, marketplaceId = "EBAY_US") {
  const domains = {
    EBAY_US: "https://www.ebay.com/itm/",
    EBAY_GB: "https://www.ebay.co.uk/itm/",
    EBAY_DE: "https://www.ebay.de/itm/",
    EBAY_AU: "https://www.ebay.com.au/itm/",
    EBAY_CA: "https://www.ebay.ca/itm/",
    EBAY_FR: "https://www.ebay.fr/itm/",
    EBAY_IT: "https://www.ebay.it/itm/",
    EBAY_ES: "https://www.ebay.es/itm/",
    EBAY_MOTORS_US: "https://www.ebay.com/itm/",
    EBAY_AT: "https://www.ebay.at/itm/",
    EBAY_CH: "https://www.ebay.ch/itm/",
    EBAY_IE: "https://www.ebay.ie/itm/",
    EBAY_NL: "https://www.ebay.nl/itm/",
    EBAY_PL: "https://www.ebay.pl/itm/",
    EBAY_BE: "https://www.befr.ebay.be/itm/",
    EBAY_HK: "https://www.ebay.com.hk/itm/",
    EBAY_SG: "https://www.ebay.com.sg/itm/",
    EBAY_MY: "https://www.ebay.com.my/itm/",
    EBAY_PH: "https://www.ebay.ph/itm/",
  };

  const domain = domains[marketplaceId] || "https://www.ebay.com/itm/";
  return `${domain}${listingId}`;
}
