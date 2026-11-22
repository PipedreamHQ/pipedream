import { axios } from "@pipedream/platform";
import {
  chatModelOptions, modelsForOperation, operationModelIds, publishedChatModels,
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
      const catalog = await axios(undefined, {
        method: "GET",
        url: "https://platform.acedata.cloud/api/v1/models/catalog/",
        timeout: 20000,
        maxRedirects: 0,
      });
      const entries = modelsForOperation(catalog, operation);
      const canonicalPath = operation.startsWith("/openai/")
        ? operation.replace("/openai/", "/v1/")
        : operation;
      const apiIds = [
        ...new Set(entries.flatMap((model) => model.endpoints
          .filter((endpoint) => endpoint.path === canonicalPath)
          .map((endpoint) => endpoint.api_id))),
      ];
      if (!apiIds.length || apiIds.some((id) => !/^[a-f0-9-]{36}$/i.test(id))) throw new Error("The published operation has no API identity.");
      const apis = await Promise.all(apiIds.map((id) => axios(undefined, {
        method: "GET",
        url: `https://platform.acedata.cloud/api/v1/apis/${id}/`,
        timeout: 20000,
        maxRedirects: 0,
      })));
      const ids = new Set();
      for (const [
        index,
        api,
      ] of apis.entries()) {
        if (api.id !== apiIds[index]) throw new Error("The public API identity did not match.");
        if (![
          operation,
          canonicalPath,
        ].includes(api.path) && api.path2 !== canonicalPath) throw new Error("The API identity does not match this operation.");
        for (const id of operationModelIds(api)) ids.add(id);
      }
      return [
        ...ids,
      ].map((id) => ({
        id,
        label: entries.find((item) => item.id === id)?.name || id,
      }));
    },
    /**
     * Send an API request with the connected account's secret key.
     * @param {Object} options - Pipedream context, path, method, and request fields.
     * @returns {Promise<Object>} API response.
     */
    request({
      $, path, data, method, params,
    }) {
      return axios($, requestOptions({
        apiKey: this.$auth.api_key,
        path,
        data,
        method,
        params,
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
