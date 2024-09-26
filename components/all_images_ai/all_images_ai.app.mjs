import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "all_images_ai",
  propDefinitions: {
    imageId: {
      type: "string",
      label: "Image Id",
      description: "Enter the unique ID of the image.",
      async options({ page }) {
        const { images } = await this.listImages({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return images.map(({ id }) => id);
      },
    },
    imageGenerationId: {
      type: "string",
      label: "Image Generation Id",
      description: "Enter the unique ID of the image.",
      async options({ page }) {
        const { prints } = await this.listGenerationImages({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });

        return prints.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.all-images.ai/v1";
    },
    _headers() {
      return {
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    generateImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image-generations",
        ...opts,
      });
    },
    getImage({
      imageGenerationId, ...opts
    }) {
      return this._makeRequest({
        path: `/image-generations/${imageGenerationId}`,
        ...opts,
      });
    },
    listImages(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/images/search",
        ...opts,
      });
    },
    listGenerationImages(opts = {}) {
      return this._makeRequest({
        path: "/image-generations",
        ...opts,
      });
    },
    purchaseImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/images/buy",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api-keys/webhook/subscribe",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api-keys/webhook/unsubscribe/${hookId}`,
      });
    },
  },
};
