import { ConfigurationError } from "@pipedream/platform";

export const PEOPLE_INCLUDE_DOMAIN_REGEX = /(^|\.)linkedin\.[a-z.]+$/i;

export function omitUndefinedValues(obj) {
  return Object.fromEntries(Object.entries(obj)
    .filter((entry) => entry[1] !== undefined));
}

export function parseOptionalJsonSchema(schema, label = "JSON schema") {
  if (schema === undefined) {
    return undefined;
  }

  if (typeof schema === "string") {
    try {
      return JSON.parse(schema);
    } catch (error) {
      throw new ConfigurationError(`Invalid ${label} format: ${error.message}. Please provide a valid JSON object.`);
    }
  }

  return schema;
}

export function buildTextConfig({
  enabled,
  maxCharacters,
  includeHtmlTags,
  verbosity,
  includeSections,
  excludeSections,
}) {
  const textOptions = omitUndefinedValues({
    maxCharacters,
    includeHtmlTags,
    verbosity,
    includeSections,
    excludeSections,
  });

  if (Object.keys(textOptions).length > 0) {
    return textOptions;
  }

  return enabled;
}

export function buildHighlightsConfig({
  enabled,
  query,
  maxCharacters,
  legacyEnabled = false,
}) {
  const highlightOptions = omitUndefinedValues({
    query,
    maxCharacters,
  });

  if (Object.keys(highlightOptions).length > 0) {
    return highlightOptions;
  }

  if (enabled !== undefined) {
    return enabled;
  }

  if (legacyEnabled) {
    return true;
  }

  return undefined;
}

export function buildSummaryConfig({
  enabled,
  query,
  schema,
}) {
  const summaryOptions = omitUndefinedValues({
    query,
    schema,
  });

  if (Object.keys(summaryOptions).length > 0) {
    return summaryOptions;
  }

  return enabled;
}

export function buildExtrasConfig({
  links,
  imageLinks,
}) {
  const extras = omitUndefinedValues({
    links,
    imageLinks,
  });

  if (Object.keys(extras).length === 0) {
    return undefined;
  }

  return extras;
}

export function resolveFreshnessParams({
  maxAgeHours,
  legacyLivecrawl,
}) {
  if (maxAgeHours !== undefined) {
    return {
      maxAgeHours,
    };
  }

  switch (legacyLivecrawl) {
  case "always":
    return {
      maxAgeHours: 0,
    };
  case "never":
    return {
      maxAgeHours: -1,
    };
  case "preferred":
    return {
      livecrawl: "preferred",
    };
  default:
    return {};
  }
}

export function addIfDefined(target, key, value) {
  if (value !== undefined) {
    target[key] = value;
  }

  return target;
}

export function validateSearchCategoryConstraints({
  category,
  includeDomains,
  excludeDomains,
  startCrawlDate,
  endCrawlDate,
  startPublishedDate,
  endPublishedDate,
}) {
  if (!category || ![
    "company",
    "people",
  ].includes(category)) {
    return;
  }

  const invalidFilters = [];

  if (startPublishedDate !== undefined) invalidFilters.push("Start Published Date");
  if (endPublishedDate !== undefined) invalidFilters.push("End Published Date");
  if (startCrawlDate !== undefined) invalidFilters.push("Start Crawl Date");
  if (endCrawlDate !== undefined) invalidFilters.push("End Crawl Date");
  if (excludeDomains !== undefined) invalidFilters.push("Exclude Domains");

  if (invalidFilters.length > 0) {
    throw new ConfigurationError(`The "${category}" category does not support these filters: ${invalidFilters.join(", ")}.`);
  }

  if (category === "people" && includeDomains?.some((domain) => !PEOPLE_INCLUDE_DOMAIN_REGEX.test(domain))) {
    throw new ConfigurationError("The \"people\" category only supports LinkedIn domains in Include Domains.");
  }
}

export function validateAdditionalQueries(type, additionalQueries) {
  if (additionalQueries === undefined) {
    return;
  }

  if (![
    "deep-lite",
    "deep",
    "deep-reasoning",
  ].includes(type)) {
    throw new ConfigurationError("Additional Queries is only supported for deep-lite, deep, or deep-reasoning searches.");
  }
}
