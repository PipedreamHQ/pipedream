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

export const normalizeImageInput = (value) => {
  const values = Array.isArray(value)
    ? value
    : [
      value,
    ];
  if (!values.length || values.some((item) => typeof item !== "string" || !/^https?:\/\/\S+$/i.test(item))) {
    throw new Error("Image must contain publicly accessible HTTP or HTTPS URLs.");
  }
  return values;
};

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

export const taskState = (task) => {
  if (!task || typeof task !== "object" || Array.isArray(task) || !Object.keys(task).length) return "not_found";
  if (task.response?.success === true) return "completed";
  if (task.response?.success === false) return "failed";
  if (task.id && task.response == null) return "pending";
  return "unknown";
};

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

export const requestOptions = ({
  apiKey, path, data,
}) => ({
  method: "POST",
  url: `https://api.acedata.cloud${path}`,
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  data,
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
  if (!/^https?:\/\/\S+$/i.test(url)) {
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

/**
 * Define a single submission action. A failed or ambiguous paid POST is never retried.
 * @param {Object} config - Component metadata and request body builder.
 * @returns {Object} Pipedream action component.
 */
export const createSubmissionAction = ({
  acedatacloud,
  key,
  name,
  description,
  path,
  props,
  buildData,
  version = "0.0.1",
}) => ({
  key,
  name,
  description,
  version,
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    ...props,
  },
  async run({ $ }) {
    const data = buildData(this);
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path,
        data: {
          ...data,
          async: true,
        },
      });
    } catch (error) {
      throw apiError(error, true);
    }
    if (typeof response?.task_id !== "string" || !response.task_id) {
      throw new Error(`${name} returned no task ID. Check task history before submitting again.`);
    }
    $.export("$summary", `Submitted ${name} task ${response.task_id}; processing is pending`);
    return {
      ...response,
      state: "submitted",
    };
  },
});
