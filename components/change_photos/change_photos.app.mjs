import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "change_photos",
  version: "0.0.20240427",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "URL of the image to transform",
    },
    effects: {
      type: "string[]",
      label: "Effects",
      description: "Effects to apply to the image",
      async options() {
        const effects = await this.getEffects();
        return effects.map((effect) => ({
          label: effect.name,
          value: effect.id,
        }));
      },
    },
    optimizations: {
      type: "string[]",
      label: "Optimizations",
      description: "Optimizations to apply to the image",
      async options() {
        const optimizations = await this.getOptimizations();
        return optimizations.map((opt) => ({
          label: opt.name,
          value: opt.id,
        }));
      },
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://www.change.photos/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.apiToken}`,
        },
      });
    },
    async getEffects(opts = {}) {
      const response = await this._makeRequest({
        method: "GET",
        path: "/effects",
        ...opts,
      });
      return response;
    },
    async getOptimizations(opts = {}) {
      const response = await this._makeRequest({
        method: "GET",
        path: "/optimizations",
        ...opts,
      });
      return response;
    },
    async transformImage(opts = {}) {
      const response = await this._makeRequest({
        method: "POST",
        path: "/transform",
        data: {
          image_url: this.imageUrl,
          effects: this.effects,
          optimizations: this.optimizations,
          ...opts,
        },
      });
      return response;
    },
  },
};
