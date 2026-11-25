/**
 * Build an authenticated request without sending it.
 * @param {Object} options - API key, fixed path, method, and request parameters.
 * @returns {Object} Options for Pipedream's axios helper.
 */
export const requestOptions = ({
  apiKey, path, data, method = "POST", timeout,
}) => ({
  method,
  url: `https://api.acedata.cloud${path}`,
  headers: {
    "content-type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  data,
  timeout,
  maxRedirects: 0,
});

/**
 * Require a nonempty user supplied string before starting a paid request.
 * @param {unknown} value - Value supplied by a workflow step.
 * @param {string} label - Public field name for validation errors.
 * @returns {string} Original text.
 */
export const requiredText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required.`);
  }
  return value;
};
