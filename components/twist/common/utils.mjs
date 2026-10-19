import { ConfigurationError } from "@pipedream/platform";

const toArray = (value) => Array.isArray(value)
  ? value
  : [
    value,
  ];

const RECIPIENT_SENTINELS = [
  "EVERYONE",
  "EVERYONE_IN_THREAD",
];

/**
 * Parses a `string[]` prop whose entries are JSON-serialized objects, leaving
 * already-parsed objects untouched. Also accepts the whole array as one JSON string
 * (the pre-1.0 contract), and flattens an entry holding a JSON array.
 */
export const parseObjectArray = (value, fieldName) => {
  if (!value) {
    return undefined;
  }
  const entries = toArray(value)
    .filter((item) => item !== undefined && item !== null && item !== "")
    .flatMap((item) => {
      if (typeof item !== "string") {
        return item;
      }
      try {
        return JSON.parse(item);
      } catch (error) {
        throw new ConfigurationError(`${fieldName}: \`${item}\` is not valid JSON`);
      }
    });
  for (const entry of entries) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      throw new ConfigurationError(`${fieldName}: \`${JSON.stringify(entry)}\` is not a JSON object`);
    }
  }
  return entries.length
    ? entries
    : undefined;
};

/**
 * Twist notification targets are either an array of numeric user IDs or one of the
 * bare sentinel strings `EVERYONE` / `EVERYONE_IN_THREAD` (not wrapped in an array).
 * A `string[]` prop carries both, so coerce numeric entries back to numbers and unwrap
 * a lone sentinel. A JSON array string (the pre-1.0 contract) is also accepted. An
 * empty list is passed through, since Twist treats `[]` as "notify no one".
 */
export const parseRecipients = (value) => {
  if (!value) {
    return undefined;
  }
  const entries = toArray(value)
    .flatMap((item) => {
      if (typeof item !== "string") {
        return item;
      }
      const trimmed = item.trim();
      if (!trimmed.startsWith("[")) {
        return trimmed;
      }
      try {
        return JSON.parse(trimmed);
      } catch (error) {
        throw new ConfigurationError(`Recipients: \`${item}\` is not valid JSON`);
      }
    })
    .filter((item) => item !== undefined && item !== null && item !== "");

  const sentinel = entries.find((item) => RECIPIENT_SENTINELS.includes(item));
  if (sentinel) {
    if (entries.length > 1) {
      throw new ConfigurationError(`Recipients: \`${sentinel}\` can't be combined with other recipients`);
    }
    return sentinel;
  }

  return entries.map((item) => {
    if (typeof item === "number") {
      return item;
    }
    if (typeof item === "string" && /^\d+$/.test(item)) {
      return Number(item);
    }
    throw new ConfigurationError(`Recipients: \`${item}\` is not a user ID, \`${RECIPIENT_SENTINELS.join("` or `")}\``);
  });
};
