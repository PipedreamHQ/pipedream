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
