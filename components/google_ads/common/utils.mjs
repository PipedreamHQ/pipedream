import { ConfigurationError } from "@pipedream/platform";

export function parseObject(value = {}) {
  return Object.fromEntries(Object.entries(value).map(([
    key,
    value,
  ]) => {
    try {
      return [
        key,
        JSON.parse(value),
      ];
    } catch (err) {
      return [
        key,
        value,
      ];
    }
  }));
}

export function parseStringObject(value = "{}") {
  try {
    return typeof value === "string"
      ? JSON.parse(value)
      : value;
  } catch (err) {
    throw new ConfigurationError(`Error parsing JSON value \`${value}\`
\\
**${err.toString()}**`);
  }
}

export function getOption(label, prefix) {
  return {
    label,
    value: `${prefix}.${label}`,
  };
}

export function getResourceOption(item, resource) {
  let label, value;
  switch (resource) {
  case "campaign":
    label = item.campaign.name;
    value = item.campaign.id;
    break;

  case "customer":
    label = item.customer.descriptiveName;
    value = item.customer.id;
    break;

  case "ad_group":
    label = item.adGroup.name;
    value = item.adGroup.id;
    break;

  case "ad_group_ad":
    label = item.adGroupAd.ad.name;
    value = item.adGroupAd.ad.id;
    break;
  }

  return {
    label,
    value,
  };
}

// Escapes a value for use inside a GAQL LIKE '...' literal: single quotes are
// doubled, and [, ], % and _ are bracket-escaped so they match literally.
export function sanitizeGaqlString(value) {
  return String(value)
    .replace(/'/g, "''")
    .replace(/[[\]%_]/g, "[$&]");
}

export function checkPrefix(value, prefix) {
  const checkStr = (s) => s && (s?.startsWith?.(`${prefix}.`)
    ? s
    : `${prefix}.${s}`);
  return Array.isArray(value ?? [])
    ? (value ?? []).map(checkStr)
    : checkStr(value);
}

// GAQL grammar: `ORDER BY Ordering (, Ordering)*` where `Ordering = FieldName (ASC | DESC)?`.
// https://developers.google.com/google-ads/api/docs/query/grammar
//
// Parses a free-form ORDER BY string into validated, normalized terms, mirroring the
// prefix-expansion already applied to the SELECT clause (fields/segments/metrics) so a
// bare field name resolves the same way in both places. Ordering by a segment or metric
// is valid GAQL, not just a resource's own fields, so all three allow-lists are tried.
// Throws ConfigurationError on any term that isn't recognized, so nothing invalid ever
// reaches SearchStream.
export function buildOrderByClause(orderBy, {
  resource, validFields, validSegments, validMetrics,
}) {
  if (!orderBy) {
    return undefined;
  }

  const terms = orderBy.split(",")
    .map((term) => term.trim())
    .filter(Boolean);

  const normalizedTerms = terms.map((term) => {
    const match = term.match(/^(\S+)(?:\s+(ASC|DESC))?$/i);
    if (!match) {
      throw new ConfigurationError(`"${term}" is not a valid ORDER BY term. Use a field, segment, or metric name optionally followed by ASC or DESC (e.g. "campaign.name ASC").`);
    }
    const [
      , rawField,
      rawDirection,
    ] = match;
    const direction = rawDirection?.toUpperCase();

    let field;
    if (rawField.includes(".")) {
      if (validFields.has(rawField) || validSegments.has(rawField) || validMetrics.has(rawField)) {
        field = rawField;
      }
    } else {
      const candidates = [
        {
          name: `${resource}.${rawField}`,
          set: validFields,
        },
        {
          name: `segments.${rawField}`,
          set: validSegments,
        },
        {
          name: `metrics.${rawField}`,
          set: validMetrics,
        },
      ];
      field = candidates.find((c) => c.set.has(c.name))?.name;
    }

    if (!field) {
      throw new ConfigurationError(`"${rawField}" is not a valid field, segment, or metric to order by for the "${resource}" resource.`);
    }

    return direction
      ? `${field} ${direction}`
      : field;
  });

  return normalizedTerms.join(", ");
}
