/**
 * Build an authenticated request without sending it.
 * @param {Object} options - API key, fixed path, method, and request parameters.
 * @returns {Object} Options for Pipedream's axios helper.
 */
export const requestOptions = ({
  apiKey, path, data, method = "POST", params, headers = {}, responseType,
}) => ({
  method,
  url: `https://api.acedata.cloud${path}`,
  headers: {
    "content-type": "application/json",
    ...Object.fromEntries(Object.entries(headers).filter(([
      name,
    ]) => name.toLowerCase() !== "authorization")
      .map(([
        name,
        value,
      ]) => [
        name.toLowerCase(),
        value,
      ])),
    "Authorization": `Bearer ${apiKey}`,
  },
  ...(data !== undefined && {
    data,
  }),
  ...(params && {
    params,
  }),
  ...(responseType && {
    responseType,
  }),
  timeout: 20000,
  maxRedirects: 0,
});

/**
 * Require a nonempty user supplied string before starting a paid request.
 * @param {unknown} value - Value supplied by a workflow step.
 * @param {string} label - Public field name for validation errors.
 * @returns {string} Trimmed value.
 */
export const requiredText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value.trim();
};
