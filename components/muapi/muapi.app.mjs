import { axios } from "@pipedream/platform";

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
      description: "Aspect ratio of the output.",
      optional: true,
      default: "1:1",
      options: ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"],
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    async post($, endpoint, data) {
      return axios($, {
        method: "POST",
        url: `https://api.muapi.ai/api/v1/${endpoint}`,
        headers: {
          "x-api-key": this._apiKey(),
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async getResult($, requestId) {
      return axios($, {
        url: `https://api.muapi.ai/api/v1/predictions/${requestId}/result`,
        headers: {
          "x-api-key": this._apiKey(),
        },
      });
    },
    async pollResult($, requestId, intervalMs = 3000) {
      while (true) {
        const result = await this.getResult($, requestId);
        if (result.status === "completed") return result.outputs;
        if (result.status === "failed") throw new Error(result.error || "Generation failed");
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    },
  },
};
