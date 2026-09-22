import { LOGICAL_OPERATORS } from "./constants.mjs";
import { ConfigurationError } from "@pipedream/platform";

export const normalizeDomain = (domain) => {
  domain = parseObject(domain) ?? [];
  if (typeof domain === "string" || !Array.isArray(domain)) {
    throw new ConfigurationError("Domain must be a valid JSON array.");
  }
  const isFullDomain = Array.isArray(domain[0]) || LOGICAL_OPERATORS[domain[0]];
  const normalizedDomain = !domain.length || isFullDomain
    ? domain
    : [
      domain,
    ];
  if (normalizedDomain.length) {
    let expectedCriteria = 1;
    for (const token of normalizedDomain) {
      if (expectedCriteria === 0) expectedCriteria = 1;
      expectedCriteria += (LOGICAL_OPERATORS[token] ?? 0) - 1;
    }
    if (expectedCriteria !== 0) {
      throw new ConfigurationError("Domain logical operators apply to the criteria that follow them. For a two-condition OR, use [\"|\", [\"name\", \"ilike\", \"25\"], [\"name\", \"ilike\", \"55\"]].");
    }
  }
  return normalizedDomain;
};

export const parseObject = (obj) => {
  if (!obj) {
    return undefined;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  }
  if (typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([
      key,
      value,
    ]) => [
      key,
      parseObject(value),
    ]));
  }
  return obj;
};
