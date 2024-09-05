import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_gemini",
  propDefinitions: {
    text: {
      type: "string",
      label: "Prompt Text",
      description: "The text to use as the prompt for content generation",
    },
    mimeType: {
      type: "string",
      label: "MIME Type",
      description: "The MIME type of the images",
      options: [
        {
          label: "PNG",
          value: "image/png",
        },
        {
          label: "JPEG",
          value: "image/jpeg",
        },
      ],
    },
    imagePaths: {
      type: "string[]",
      label: "Image File Paths",
      description: "The local file paths of the images to use in the content generation. The path to the image file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for content generation",
      async options({ prevContext: { pageToken } }) {
        if (pageToken === null) {
          return [];
        }
        const {
          models,
          nextPageToken,
        } = await this.listModels({
          params: {
            pageToken,
          },
        });
        const options = models.map(({
          name: value,
          displayName: label,
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            pageToken: nextPageToken || null,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getParams(params) {
      return {
        ...params,
        key: this.$auth.api_key,
      };
    },
    makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      const config = {
        url: this.getUrl(path),
        params: this.getParams(params),
        headers: {
          "Content-Type": "application/json",
        },
        ...args,
      };
      return axios($, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    generateContent({
      model, ...args
    } = {}) {
      const pathPrefix = model.startsWith("models/")
        ? model
        : `models/${model}`;
      return this.post({
        path: `/${pathPrefix}:generateContent`,
        ...args,
      });
    },
    listModels(args = {}) {
      return this.makeRequest({
        path: "/models",
        ...args,
      });
    },
  },
};
