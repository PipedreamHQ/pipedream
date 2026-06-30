import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.muapi.ai/api/v1";

export default {
  type: "app",
  app: "muapi",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Text description of the content to generate.",
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Aspect ratio of the output (e.g. 16:9, 9:16, 1:1, 4:3, 3:4, 21:9).",
      optional: true,
      default: "1:1",
      options: [
        "1:1",
        "16:9",
        "9:16",
        "4:3",
        "3:4",
        "21:9",
      ],
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    async _makeRequest($, {
      method = "GET", path, data, ...opts
    } = {}) {
      return axios($, {
        method,
        url: `${BASE_URL}/${path}`,
        headers: {
          "x-api-key": this._apiKey(),
          "Content-Type": "application/json",
        },
        data,
        ...opts,
      });
    },
    async post($, endpoint, data) {
      return this._makeRequest($, {
        method: "POST",
        path: endpoint,
        data,
      });
    },
    async getResult($, requestId) {
      return this._makeRequest($, {
        path: `predictions/${requestId}/result`,
      });
    },
    async pollResult($, requestId, intervalMs = 3000, timeoutMs = 600000) {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const result = await this.getResult($, requestId);
        if (result.status === "completed") return result.outputs;
        if (result.status === "failed") throw new Error(result.error || "Generation failed");
        await new Promise((r) => setTimeout(r, intervalMs));
      }
      throw new Error(`Generation timed out after ${timeoutMs / 1000}s`);
    },
  },
};
