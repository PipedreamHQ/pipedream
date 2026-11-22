import { axios } from "@pipedream/platform";
import {
  chatModelOptions, operationModelIds, publishedChatModels,
} from "./common/chat.mjs";
import { requestOptions } from "./common/utils.mjs";

export default {
  type: "app",
  app: "acedatacloud",
  propDefinitions: {
    chatModel: {
      type: "string",
      label: "Model",
      description: "Published chat model available through the connected API. Use **List Chat Models** and its `id` field to inspect all model families. The dropdown uses the same catalog; no model fallback is applied.",
      async options() {
        return chatModelOptions(await this.listChatModels());
      },
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Seedream model. Lite supports larger output sizes; Pro supports higher quality single images. E.g. `doubao-seedream-5-0-lite-260128`.",
      async options() {
        return chatModelOptions(await this.listModelsForOperation("/seedream/images"));
      },
      default: "doubao-seedream-5-0-lite-260128",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Describe the image to generate or the edit to make. E.g. `a blue glass cube on a white table`.",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Public HTTP or HTTPS image input. E.g. `https://example.com/photo.png`.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Output size. Lite supports 2K, 3K, and 4K; Pro supports 1K, 1.5K, and 2K. E.g. `2K`.",
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
      description: "Whether to add a watermark to the generated image. E.g. `false`.",
      optional: true,
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
     * Fetch public model choices for a specific media API; no consumer key is sent.
     * @param {string} operation - The action's existing API path.
     * @returns {Promise<Object[]>} Published model records for this operation.
     */
    async listModelsForOperation(operation) {
      const result = await axios(undefined, {
        method: "GET",
        url: "https://platform.acedata.cloud/api/v1/apis/",
        params: {
          path: operation,
        },
        timeout: 20000,
        maxRedirects: 0,
      });
      if (!Array.isArray(result?.items) || result.count > result.items.length) {
        throw new Error("The public API lookup returned an incomplete result.");
      }
      const apis = result.items.filter((api) => (api.path === operation || api.path2 === operation)
        && api.method === "POST" && api.stage !== "Deprecated");
      if (!apis.length) throw new Error("No active published API matches this operation.");
      const ids = new Set(apis.flatMap((api) => operationModelIds(api)));
      return [
        ...ids,
      ].map((id) => ({
        id,
        label: id,
      }));
    },
    /**
     * Send an API request with the connected account's secret key.
     * @param {Object} options - Pipedream context, path, method, and request fields.
     * @returns {Promise<Object>} API response.
     */
    request({
      $, path, data, method, params, headers,
    }) {
      return axios($, requestOptions({
        apiKey: this.$auth.api_key,
        path,
        data,
        method,
        params,
        headers,
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
  },
};
