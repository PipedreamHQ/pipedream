import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "linkly",
  propDefinitions: {
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID of the Linkly link",
      async options({ page }) {
        const { links } = await this.listLinks({
          params: {
            page: page + 1,
          },
        });
        return links?.map(({
          id: value, url: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.linklyhq.com/api/v1";
    },
    _authParams(params) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    workspaceId() {
      return this.$auth.workspace_id;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
      });
    },
    getLink({
      linkId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/link/${linkId}`,
      });
    },
    listLinks(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/workspace/${this.workspaceId()}/list_links`,
      });
    },
    createLink(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/link",
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      resourceType,
    }) {
      params = {
        ...params,
        page: 1,
        page_size: constants.DEFAULT_LIMIT,
      };
      let total = 0;
      do {
        const response = await resourceFn({
          params,
        });
        const items = response[resourceType];
        for (const item of items) {
          yield item;
        }
        total = items.length;
        params.page++;
      } while (total === params.page_size);
    },
  },
};
