import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "flippingbook",
  propDefinitions: {
    flipbookId: {
      type: "string",
      label: "Flipbook ID",
      description: "The unique identifier of the flipbook.",
      async options({ page }) {
        const { publications } = await this.listFlipbooks({
          params: {
            count: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return publications?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the publication",
    },
    info: {
      type: "alert",
      alertType: "info",
      content: "Please provide exactly one of File URL or File Path.",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the .pdf file that will be used to create the source for the publication. The URL must be publicly accessible for at least for several minutes.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a .pdf file in the `/tmp` directory be used to create the source for the publication. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of your PDF file",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Publication description",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api-tc.is.flippingbook.com/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/fbonline/triggers",
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/fbonline/triggers/${hookId}`,
      });
    },
    getFlipbook({
      flipbookId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/fbonline/publication/${flipbookId}`,
      });
    },
    listFlipbooks(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/fbonline/publication",
      });
    },
    createFlipbook(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/fbonline/publication",
      });
    },
    updateFlipbook({
      flipbookId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/fbonline/publication/${flipbookId}`,
      });
    },
  },
};
