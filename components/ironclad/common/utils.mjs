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
      return `${description}. Array of type \`${elementType.type}\`. Example: \`{"url": "https://your.file.server.test/test-doc-1.docx"}\``;
    }
    if (elementType.type === "object") {
      return `${description}. Array of type \`${elementType.type}\`. See the [docs](https://developer.ironcladapp.com/docs/launch-a-workflow#32-create-request-body-attributes) for more information about field types.`;
    }
    return `${description}. Array of type \`${elementType.type}\`.`;
  }
  return description;
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
