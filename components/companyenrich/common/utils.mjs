import { ConfigurationError } from "@pipedream/platform";
import JSONBigInt from "json-bigint";
import {
  ACCOUNT_CAPABILITY_FIELDS,
  COMPANY_EXPANSIONS,
  PERSON_EXPANSIONS,
} from "./constants.mjs";

const JSON_PARSER = JSONBigInt({
  storeAsString: true,
  protoAction: "ignore",
  constructorAction: "ignore",
});

export function parseResponse(value) {
  if (typeof value !== "string" || !value) {
    return value;
  }
  try {
    return JSON_PARSER.parse(value);
  } catch {
    return value;
  }
}

export function stringValue(value, label, max = 1024, required = false) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new ConfigurationError(`${label} is required.`);
    }
    return undefined;
  }
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new ConfigurationError(`${label} must be a nonempty string of at most ${max} characters.`);
  }
  return value;
}

export function integerValue(value, label, min, max, defaultValue) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ConfigurationError(`${label} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

export function booleanValue(value, label, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  if (typeof value !== "boolean") {
    throw new ConfigurationError(`${label} must be a boolean.`);
  }
  return value;
}

export function stringArray(value, label, min, max, allowed) {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!Array.isArray(value) || value.length < min || value.length > max) {
    throw new ConfigurationError(`${label} must be an array containing ${min} to ${max} strings.`);
  }
  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) {
      throw new ConfigurationError(`${label} must contain only nonempty strings.`);
    }
    if (allowed && !allowed.includes(item)) {
      throw new ConfigurationError(`${label} must use only: ${allowed.join(", ")}.`);
    }
  }
  return value;
}

export function objectValue(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new ConfigurationError(`${label} must be a valid JSON object.`);
    }
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object"
    || ![
      Object.prototype,
      null,
    ].includes(Object.getPrototypeOf(parsed))) {
    throw new ConfigurationError(`${label} must be a JSON object, not an array or scalar.`);
  }
  return parsed;
}

function checkKeys(value, allowed, label) {
  if (Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new ConfigurationError(`${label} accepts only: ${allowed.join(", ")}.`);
  }
}

function numberValue(value, label, min, max) {
  if (value !== undefined && value !== null
    && (!Number.isFinite(value) || value < min || value > max)) {
    throw new ConfigurationError(`${label} must be a number between ${min} and ${max}.`);
  }
}

export function companyQuery({
  companyFilter, semantic, lookalike,
} = {}) {
  const filter = objectValue(companyFilter, "Company Filter");
  const semanticQuery = objectValue(semantic, "Semantic Query");
  const lookalikeQuery = objectValue(lookalike, "Lookalike Query");
  if (semanticQuery && lookalikeQuery) {
    throw new ConfigurationError("Semantic Query and Lookalike Query cannot be combined.");
  }
  if (semanticQuery) {
    checkKeys(semanticQuery, [
      "query",
      "weight",
      "autoFilter",
    ], "Semantic Query");
    stringValue(semanticQuery.query, "Semantic Query query", 500, true);
    numberValue(semanticQuery.weight, "Semantic Query weight", 0, 1);
    if (semanticQuery.autoFilter !== undefined && semanticQuery.autoFilter !== null
      && typeof semanticQuery.autoFilter !== "boolean") {
      throw new ConfigurationError("Semantic Query autoFilter must be a boolean.");
    }
  }
  if (lookalikeQuery) {
    checkKeys(lookalikeQuery, [
      "domains",
      "weight",
      "minScore",
    ], "Lookalike Query");
    if (!Array.isArray(lookalikeQuery.domains)) {
      throw new ConfigurationError("Lookalike Query requires a domains array.");
    }
    stringArray(lookalikeQuery.domains, "Lookalike Query domains", 1, 10);
    for (const domain of lookalikeQuery.domains) {
      stringValue(domain, "Lookalike Query domain", 1024, true);
    }
    numberValue(lookalikeQuery.weight, "Lookalike Query weight", -1, 1);
    numberValue(lookalikeQuery.minScore, "Lookalike Query minScore", 0, 1);
  }
  return {
    filter,
    semantic: semanticQuery,
    lookalike: lookalikeQuery,
  };
}

export function peopleQuery({
  personFilter, companyQuery: companyInput,
} = {}) {
  const filter = objectValue(personFilter, "Person Filter");
  const company = objectValue(companyInput, "Company Query");
  if (company) {
    checkKeys(company, [
      "filter",
      "semantic",
      "lookalike",
    ], "Company Query");
  }
  return {
    filter,
    company: company && companyQuery({
      companyFilter: company.filter,
      semantic: company.semantic,
      lookalike: company.lookalike,
    }),
  };
}

export function companyExpansions(value) {
  return stringArray(value, "Company Expansions", 0, Infinity, COMPANY_EXPANSIONS);
}

export function personExpansions(value) {
  return stringArray(value, "Person Expansions", 0, Infinity, PERSON_EXPANSIONS);
}

export function companyId(value) {
  const id = stringValue(value, "Company ID", 36, true);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ConfigurationError("Company ID must be a UUID returned by Search Companies or Enrich Company.");
  }
  return id;
}

export function personId(value) {
  const id = stringValue(value, "Person ID", 19, true);
  if (!/^\d+$/.test(id) || BigInt(id) < 1n || BigInt(id) > 9223372036854775807n) {
    throw new ConfigurationError("Person ID must be a positive int64 decimal string returned by Search People.");
  }
  return id;
}

export function countryCode(value) {
  const code = stringValue(value, "Country Code", 2, true);
  if (!/^[a-z]{2}$/i.test(code)) {
    throw new ConfigurationError("Country Code must contain two letters, e.g. US.");
  }
  return code;
}

export function safeAccount(response) {
  const result = {};
  if (typeof response?.userId === "string") {
    result.userId = response.userId;
  }
  if (response?.credits && typeof response.credits === "object") {
    result.credits = {};
    for (const field of [
      "used",
      "total",
    ]) {
      if (Number.isFinite(response.credits[field])) {
        result.credits[field] = response.credits[field];
      }
    }
  }
  if (response?.capabilities && typeof response.capabilities === "object") {
    result.capabilities = {};
    for (const field of ACCOUNT_CAPABILITY_FIELDS) {
      const value = response.capabilities[field];
      if (typeof value === "boolean" || Number.isFinite(value)) {
        result.capabilities[field] = value;
      }
    }
  }
  return result;
}

export function serializeParams(params = {}) {
  const result = new URLSearchParams();
  for (const [
    key,
    value,
  ] of Object.entries(params)) {
    const values = Array.isArray(value)
      ? value
      : [
        value,
      ];
    for (const item of values) {
      if (item !== undefined && item !== null) {
        result.append(key, String(item));
      }
    }
  }
  return result.toString();
}
