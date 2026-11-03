import { ConfigurationError } from "@pipedream/platform";

export function integer(value, name, minimum, maximum) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new ConfigurationError(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

export function text(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw new ConfigurationError(`${name} is required.`);
  }
  return value.trim();
}

export function countries(values = []) {
  if (!Array.isArray(values)) {
    throw new ConfigurationError("Countries must be an array of two-letter country codes.");
  }
  const result = values.map((value) => text(value, "Country").toUpperCase());
  if (result.some((value) => !/^[A-Z]{2}$/.test(value))) {
    throw new ConfigurationError("Countries must contain two-letter country codes, such as US.");
  }
  return [
    ...new Set(result),
  ];
}

export function companyId(value) {
  const id = text(value, "Company ID");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new ConfigurationError("Company ID must be a UUID returned by Search Companies Page.");
  }
  return id;
}
