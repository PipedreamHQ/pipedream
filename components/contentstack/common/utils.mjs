export function parseArray(value) {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`Could not parse as array: ${value}`);
    }
  }
  return value;
}

export function parseEntry(entry) {
  if (!entry) {
    return undefined;
  }
  if (typeof entry === "string") {
    try {
      return JSON.parse(entry);
    } catch {
      throw new Error("Could not parse entry as JSON");
    }
  }
  const parsedEntry = {};
  for (const [
    key,
    value,
  ] of Object.entries(entry)) {
    if (typeof value === "string") {
      try {
        parsedEntry[key] = JSON.parse(value);
      } catch {
        parsedEntry[key] = value;
      }
    } else {
      parsedEntry[key] = value;
    }
  }
  return parsedEntry;
}
