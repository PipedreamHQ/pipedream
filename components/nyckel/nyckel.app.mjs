import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nyckel",
  propDefinitions: {
    functionId: {
      type: "string",
      label: "Function ID",
      description: "Select a function or provide a custom function ID.",
      async options({ context: { cursor } }) {
        const items = await this.listFunctions({
          params: {
            cursor,
          },
        });
        return {
          context: {
            cursor: items[items.length - 1].id,
          },
          options: items.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    imageOrUrl: {
      type: "string",
      label: "Image Path or URL",
      description: "The path to an image file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp). Alternatively, you can pass the direct URL to a file.",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "A URL pointing to the image.",
    },
    includeRegions: {
      type: "boolean",
      label: "Include Regions",
      description: "When set to true, return the regions of the image that contained text",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Text data for classification",
    },
    classifications: {
      type: "string[]",
      label: "Classifications",
      description: "Optional specifications for classifications to focus on",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.nyckel.com/v0.9";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listFunctions(args) {
      return this._makeRequest({
        url: "/functions",
        ...args,
      });
    },
    async extractTextFromImageUrl({
      functionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/ocr`,
        ...args,
      });
    },
    async classifyTextData({
      functionId, data, classifications,
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/classify`,
        data: {
          data,
          classifications,
        },
      });
    },
    async classifyImageData({
      functionId, imageData, classifications,
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/classify`,
        data: {
          imageData,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          classifications,
        },
      });
    },
  },
};
