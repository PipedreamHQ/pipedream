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
      return `${description}. Array of type \`${elementType.type}\`. Ironclad fetches this URL server-side, so it must be a real, publicly-reachable file — not a placeholder or made-up domain (a fabricated URL fails with \`CONTENT_UNAVAILABLE\`). If you don't have a specific document to upload, use this working sample PDF: \`{"url": "https://file-examples.com/storage/fe99faaddd6a870e791ac7b/2017/10/file-sample_150kB.pdf"}\`.`;
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
    for (const [
      selectorKey,
      selectorField,
    ] of selectors) {
      if (selectorKey === key) {
        continue;
      }
      const match = selectorField.options.values
        .find((value) => key.toLowerCase().startsWith(slugify(value)));
      if (match) {
        field.dependsOn = {
          field: selectorKey,
          value: match,
        };
        break;
      }
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
