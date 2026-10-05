import { axios } from "@pipedream/platform";

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

export default {
  type: "app",
  app: "acedatacloud",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "Public Seedream model. Lite supports larger output sizes; Pro supports higher quality single images.",
      options: [
        {
          label: "Seedream 5.0 Lite",
          value: "doubao-seedream-5-0-lite-260128",
        },
        {
          label: "Seedream 5.0 Pro",
          value: "doubao-seedream-5-0-pro-260628",
        },
      ],
      default: "doubao-seedream-5-0-lite-260128",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Describe the image to generate or the edit to make.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Output size. Lite supports 2K, 3K, and 4K; Pro supports 1K, 1.5K, and 2K.",
      options: [
        "1K",
        "1.5K",
        "2K",
        "3K",
        "4K",
      ],
      default: "2K",
    },
    watermark: {
      type: "boolean",
      label: "Watermark",
      description: "Whether to add a watermark to the generated image.",
      optional: true,
    },
  },
  methods: {
    /**
     * Send a JSON request with the connected account's secret key.
     * @param {Object} options - Pipedream context, path, and JSON data.
     * @returns {Promise<Object>} API response.
     */
    request({
      $, path, data,
    }) {
      return axios($, requestOptions({
        apiKey: this.$auth.api_key,
        path,
        data,
      }));
    },
    /**
     * Submit one image job. Never retry a paid POST automatically.
     * @param {Object} options - Pipedream context and image body.
     * @returns {Promise<Object>} Submission envelope with task ID.
     */
    submitImage({
      $, data,
    }) {
      return this.request({
        $,
        path: "/seedream/images",
        data: {
          ...data,
          response_format: "url",
          async: true,
        },
      });
    },
    /**
     * Read a previously submitted task without resubmitting generation.
     * @param {Object} options - Pipedream context and task ID.
     * @returns {Promise<Object>} Full task record.
     */
    getImageTask({
      $, taskId,
    }) {
      return this.request({
        $,
        path: "/seedream/tasks",
        data: {
          action: "retrieve",
          id: taskId,
        },
      });
    },
  },
};
