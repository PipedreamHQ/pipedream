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
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
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
