import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nyckel",
  propDefinitions: {
    functionId: {
      type: "string",
      label: "Function ID",
      description: "Select a function or provide a custom function ID.",
      async options({ prevContext: { cursor } }) {
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
    includeRegions: {
      type: "boolean",
      label: "Include Regions",
      description: "When set to true, return the regions of the image that contained text",
      optional: true,
    },
    labelCount: {
      type: "integer",
      label: "Label Count",
      description: "The number of labels to return, along with their confidences. When not specified, only the highest confidence result is returned.",
      optional: true,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Whether to include the label metadata in the response.",
      optional: true,
      default: false,
    },
    capture: {
      type: "boolean",
      label: "Capture",
      description: "Whether to enable invoke capture for this invoke. Invoke capture saves informative samples captured from your invokes for future annotation.",
      optional: true,
      default: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "Your unique identifier for this sample. This will be used if this invoke is saved through Invoke Capture.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.nyckel.com";
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
        url: "/v1/functions",
        ...args,
      });
    },
    async extractTextFromImageUrl({
      functionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/v0.9/functions/${functionId}/ocr`,
        ...args,
      });
    },
    async invokeFunction({
      functionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/v1/functions/${functionId}/invoke`,
        ...args,
      });
    },
  },
};
