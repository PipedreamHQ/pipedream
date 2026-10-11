export const MODELS = {
  "doubao-seedream-5-0-lite-260128": [
    "2K",
    "3K",
    "4K",
  ],
  "doubao-seedream-5-0-pro-260628": [
    "1K",
    "1.5K",
    "2K",
  ],
};

/**
 * Normalize one or more public image URLs for a Seedream request.
 * @param {string|string[]} value - Image URL or list of image URLs.
 * @returns {string[]} Validated image URLs.
 */
export const normalizeImageInput = (value) => {
  const values = Array.isArray(value)
    ? value
    : [
      value,
    ];
  if (!values.length || values.some((item) => !isHttpUrl(item))) {
    throw new Error("Image must contain publicly accessible HTTP or HTTPS URLs.");
  }
  return values;
};

/**
 * Check an HTTP URL has an actual hostname before accepting it as media input.
 * @param {unknown} value - Candidate media URL.
 * @returns {boolean} Whether the URL can be used as a public media reference.
 */
export const isHttpUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\/\S+$/i.test(value)) return false;
  try {
    const parsed = new URL(value);
    return [
      "http:",
      "https:",
    ].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
};

/**
 * Validate model, prompt, size, and reference count before submission.
 * @param {Object} request - Seedream image request fields.
 * @returns {void}
 */
export const validateImageRequest = ({
  model, prompt, size, images,
}) => {
  if (!Object.hasOwn(MODELS, model)) {
    throw new Error("Choose a supported public Seedream model.");
  }
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt is required.");
  }
  if (!MODELS[model].includes(size)) {
    throw new Error(`Size ${size} is unavailable for ${model}.`);
  }
  if (images && images.length > (model.includes("-pro-")
    ? 10
    : 14)) {
    throw new Error("Too many reference images for the selected model.");
  }
};

/**
 * Preserve definite client errors and warn when a paid submission is ambiguous.
 * @param {Error} error - Transport or API error.
 * @param {boolean} [submitting=false] - Whether this was a paid submission.
 * @returns {Error} Error to surface to the workflow.
 */
export const apiError = (error, submitting = false) => {
  const status = error?.response?.status || error?.status;
  if (submitting && status >= 400 && status < 500 && status !== 408) return error;
  const suffix = status
    ? ` (HTTP ${status})`
    : "";
  if (submitting) {
    return new Error(`Image submission did not return a task ID${suffix}. The request may have created a paid task. Check task history before submitting again.`);
  }
  return new Error(`Task lookup failed${suffix}. Retry lookup with the same task ID; do not resubmit the image request.`);
};

/**
 * Build an authenticated request without sending it.
 * @param {Object} options - API key, fixed path, method, and request parameters.
 * @returns {Object} Options for Pipedream's axios helper.
 */
export const requestOptions = ({
  apiKey, path, data, method = "POST", params,
}) => ({
  method,
  url: `https://api.acedata.cloud${path}`,
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  ...(data !== undefined && {
    data,
  }),
  ...(params && {
    params,
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

/**
 * Accept only a public-style HTTP or HTTPS input URL.
 * @param {unknown} value - Workflow field value.
 * @param {string} label - Public field name for validation errors.
 * @returns {string} Valid URL string.
 */
export const requiredHttpUrl = (value, label) => {
  const url = requiredText(value, label);
  if (!isHttpUrl(url)) {
    throw new Error(`${label} must be an HTTP or HTTPS URL.`);
  }
  return url;
};

/**
 * Parse a structured workflow field without making a network request.
 * @param {unknown} value - JSON text or an already parsed object.
 * @param {string} label - Public field name for validation errors.
 * @returns {Object|Array} Parsed JSON value.
 */
export const structuredInput = (value, label) => {
  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error(`${label} must be valid JSON.`);
    }
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) && !parsed.length) {
    throw new Error(`${label} must be a nonempty JSON object or array.`);
  }
  return parsed;
};
