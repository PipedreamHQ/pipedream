import { ConfigurationError } from "@pipedream/platform";

export const parseJson = (json) => {
  if (!json) return undefined;

  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch (error) {
      throw new ConfigurationError(`Invalid JSON string: ${json}`);
    }
  }

  return json;
};

export const stringifyJson = (json) => {
  // Treat empty arrays as absent: an optional array prop the agent left effectively
  // empty (e.g. accessTypes: []) must not become the literal query param "[]", which
  // Wrike rejects with HTTP 400. `[]` is truthy, so the `!json` guard alone misses it.
  if (!json || (Array.isArray(json) && json.length === 0)) return undefined;

  if (typeof json === "object" || Array.isArray(json)) {
    return JSON.stringify(json);
  }

  return json;
};
