export function parseProp(prop) {
  if (typeof prop === "string") {
    try {
      return JSON.parse(prop);
    } catch {
      return prop;
    }
  }
  return prop;
}

export function parseArray(prop) {
  if (!prop) {
    return [];
  }
  const parsed = parseProp(prop);
  if (Array.isArray(parsed)) {
    return parsed.map((item) => (typeof item === "string" ? item.trim() : item)).filter(Boolean);
  }
  if (typeof parsed === "string") {
    return parsed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [
    parsed,
  ];
}

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

export function cleanObject(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    const cleanedArr = obj.map(cleanObject).filter((item) => item !== undefined && item !== null && item !== "");
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
    EBAY_BE: "https://www.benl.ebay.be/itm/",
    EBAY_FRBE: "https://www.befr.ebay.be/itm/",
    EBAY_HK: "https://www.ebay.com.hk/itm/",
    EBAY_SG: "https://www.ebay.com.sg/itm/",
    EBAY_MY: "https://www.ebay.com.my/itm/",
    EBAY_PH: "https://www.ebay.ph/itm/",
  };

  const domain = domains[marketplaceId] || "https://www.ebay.com/itm/";
  return `${domain}${listingId}`;
}
