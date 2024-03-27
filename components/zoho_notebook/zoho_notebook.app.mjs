import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_notebook",
  propDefinitions: {
    notebookId: {
      type: "string",
      label: "Notebook ID",
      description: "The identifier of the notebook where the notecard will be created",
      async options({ page }) {
        const { notebooks } = await this.listNotebooks({
          params: {
            limit: constants.DEFAULT_LIMIT,
            offset: page * constants.DEFAULT_LIMIT,
          },
        });
        return notebooks?.map(({
          notebook_id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://notebook.${this.$auth.base_api_uri}/api/v1`;
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
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listNotebooks(opts = {}) {
      return this._makeRequest({
        path: "/notebooks",
        ...opts,
      });
    },
    listNotecards({
      notebookId, ...opts
    }) {
      return this._makeRequest({
        path: `/notebooks/${notebookId}/notecards`,
        ...opts,
      });
    },
    createNotebook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/notebooks",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args = {},
      resourceType,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          limit: constants.DEFAULT_LIMIT,
          offset: 0,
        },
      };
      let total, count = 0;
      do {
        const results = await resourceFn(args);
        const items = results[resourceType];
        if (!items) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = items?.length;
        args.params.offset += args.params.limit;
      } while (total === args.params.limit);
    },
  },
};
