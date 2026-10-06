import { axios } from "@pipedream/platform";
import { requestOptions } from "./common/utils.mjs";

export default {
  type: "app",
  app: "acedatacloud",
  propDefinitions: {
    model: {
      type: "string",
      label: "Model",
      description: "Public Seedream model. Lite supports larger output sizes; Pro supports higher quality single images. E.g. `doubao-seedream-5-0-lite-260128`.",
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
      description: "Describe the image to generate or the edit to make. E.g. `a blue glass cube on a white table`.",
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
