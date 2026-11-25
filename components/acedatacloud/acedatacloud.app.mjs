import { axios } from "@pipedream/platform";
import {
  chatModelOptions, publishedChatModels,
} from "./common/chat.mjs";
import { requestOptions } from "./common/utils.mjs";

export default {
  type: "app",
  app: "acedatacloud",
  propDefinitions: {
    "chatModel": {
      type: "string",
      label: "Model",
      description: "Published chat model available through the connected API. Use **List Chat Models** and its `id` field to inspect all model families. The dropdown uses the same catalog; no model fallback is applied. Example: `gpt-6.2-astra`.",
      async options() {
        return chatModelOptions(await this.listChatModels());
      },
    },
    "prompt": {
      type: "string",
      label: "Prompt",
      description: "Text to send to the selected model.",
    },
  },
  methods: {
    /**
     * Load models from the authenticated API and the published typed chat catalog.
     * @param {Object} options - Optional Pipedream context.
     * @returns {Promise<Object[]>} Models present in both current lists.
     */
    async listChatModels({ $ } = {}) {
      const [
        available,
        published,
      ] = await Promise.all([
        this.request({
          $,
          path: "/v1/models",
          method: "GET",
        }),
        axios($, {
          method: "GET",
          url: "https://platform.acedata.cloud/api/v1/models/",
          params: {
            type: "chat",
          },
          timeout: 20000,
          maxRedirects: 0,
        }),
      ]);
      return publishedChatModels(available, published);
    },
    /**
     * Send an API request with the connected account's secret key.
     * @param {Object} options - Pipedream context, path, method, and request fields.
     * @returns {Promise<Object>} API response.
     */
    request({
      $, path, data, method, params, headers, responseType,
    }) {
      return axios($, requestOptions({
        apiKey: this.$auth.api_key,
        path,
        data,
        method,
        params,
        headers,
        responseType,
      }));
    },
  },
};
