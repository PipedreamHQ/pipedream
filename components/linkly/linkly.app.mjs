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
    domain: {
      type: "string",
      label: "Domain",
      description: "Custom domain to use for the short URL (e.g. `links.example.com`). Leave empty to use the default Linkly domain. A custom slug requires a custom domain.",
      optional: true,
      async options() {
        const { domains } = await this.listDomains();
        return domains?.map(({ name }) => name) || [];
      },
    },
    url: {
      type: "string",
      label: "URL",
      description: "The destination URL the short link should redirect to",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Nickname for the link, shown in your Linkly dashboard",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "Custom slug for the short URL (e.g. `summer-sale`). Requires a custom **Domain** to be set; leave empty to auto-generate.",
      optional: true,
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
    updateLink({
      linkId, data, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/link",
        data: {
          ...data,
          id: linkId,
        },
      });
    },
    deleteLink({
      linkId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/workspace/${this.workspaceId()}/links/${linkId}`,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/workspace/${this.workspaceId()}/domains`,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/workspaces",
      });
    },
    subscribeWorkspaceWebhook({
      url, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/workspace/${this.workspaceId()}/webhooks`,
        data: {
          url,
        },
      });
    },
    unsubscribeWorkspaceWebhook({
      url, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "DELETE",
        path: `/workspace/${this.workspaceId()}/webhooks/${encodeURIComponent(url)}`,
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
