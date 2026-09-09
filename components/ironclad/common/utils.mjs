import { ConfigurationError } from "@pipedream/platform";

export function parseJsonObject(value, label) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (err) {
    throw new ConfigurationError(`${label} must be valid JSON: ${err.message}`);
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError(`${label} must be a JSON object, e.g. {"key": "value"}.`);
  }
  return parsed;
}

export function getAttributeDescription({
  type, displayName, elementType,
}) {
  const description = `Value of ${displayName}`;
  if (type === "address") {
    return `${description}. Example: \`{
      "lines": [
        "325 5th Street",
        "Suite 200"
      ],
      "locality": "San Francisco",
      "region": "California",
      "postcode": "94107",
      "country": "USA"
    }\``;
  }
  if (type === "monetaryAmount") {
    return `${description}. Example: \`{
      "currency": "USD",
      "amount": 25.37
    }\``;
  }
  if (type === "date") {
    return `${description}. Example: \`2021-05-11T17:16:53-07:00\``;
  }
  if (type === "duration") {
    return `${description}. Example \`{
      "years": 1,
      "months": 2,
      "weeks": 3,
      "days": 4
    }\``;
  }
  if (type === "email") {
    return `${description}. Example: \`test@gmail.com\``;
  }
  if (type === "array") {
    if (elementType.type === "document") {
      return `${description}. Array of type \`${elementType.type}\`. Example shape: \`{"url": "https://your-file-host.example.com/document.pdf"}\`. Ironclad fetches this URL server-side, so it must be a real, publicly-reachable file — not a placeholder or made-up domain (a fabricated URL fails with \`CONTENT_UNAVAILABLE\`).`;
    }
    if (elementType.type === "object") {
      return `${description}. Array of type \`${elementType.type}\`. See the [docs](https://developer.ironcladapp.com/docs/launch-a-workflow#32-create-request-body-attributes) for more information about field types.`;
    }
    return `${description}. Array of type \`${elementType.type}\`.`;
  }
  return description;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Ironclad's public workflow-schema API marks a field `required: "conditional"`
 * without exposing which other field's value triggers that requirement. In
 * practice, tenant "field set" builders name the conditional fields with a
 * prefix matching the selector option that reveals them (e.g. selecting
 * `"Set 1"` on a field-set selector reveals fields named `set1...`). This is
 * a naming-convention heuristic, not a guarantee from the API — fields where
 * no match is found are left unannotated.
 */
export function inferConditionalDependencies(schema) {
  const selectors = Object.entries(schema)
    .filter(([
      ,
      field,
    ]) => field.type === "string" && field.options?.values?.length);

  for (const [
    key,
    field,
  ] of Object.entries(schema)) {
    if (field.required !== "conditional") {
      continue;
    }
    const matches = [];
    for (const [
      selectorKey,
      selectorField,
    ] of selectors) {
      if (selectorKey === key) {
        continue;
      }
      for (const value of selectorField.options.values) {
        if (key.toLowerCase().startsWith(slugify(value))) {
          matches.push({
            field: selectorKey,
            value,
          });
        }
      }
    }
    if (matches.length === 1) {
      field.dependsOn = matches[0];
    }
  }
  return schema;
}

export function parseValue(value) {
  if (!value) {
    return undefined;
  }
  try {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    if (Array.isArray(value)) {
      return value.map(JSON.parse);
    }
    return value;
  } catch {
    return value;
  }
}
