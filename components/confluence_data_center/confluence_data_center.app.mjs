import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "confluence_data_center",
  propDefinitions: {
    spaceKey: {
      type: "string",
      label: "Space Key",
      description: "Select a space or provide its key",
      async options({ page }) {
        const { results } = await this.listSpaces({
          params: {
            limit: DEFAULT_LIMIT,
            start: page * DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          key: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    contentId: {
      type: "string",
      label: "Content ID",
      description: "Select a page or blogpost or provide its ID",
      async options({
        page, type,
      }) {
        const { results } = await this.listContent({
          params: {
            type,
            limit: DEFAULT_LIMIT,
            start: page * DEFAULT_LIMIT,
          },
        });
        return results?.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the content",
      async options() {
        return [
          "page",
          "blogpost",
        ];
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the content",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the content",
      optional: true,
      options: [
        "current",
        "draft",
      ],
    },
    position: {
      type: "integer",
      label: "Position",
      description: "The position of the content",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body content of the content",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata of the content",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return",
      optional: true,
      default: 100,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "Start index of the results to return",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/rest/api`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.personal_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
        ...opts,
      });
    },
    getContentById({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/content/${id}`,
        ...opts,
      });
    },
    listSpaces(opts = {}) {
      return this._makeRequest({
        path: "/space",
        ...opts,
      });
    },
    listContent(opts = {}) {
      return this._makeRequest({
        path: "/content",
        ...opts,
      });
    },
    searchContent(opts = {}) {
      return this._makeRequest({
        path: "/content/search",
        ...opts,
      });
    },
    createContent(opts = {}) {
      return this._makeRequest({
        path: "/content",
        method: "POST",
        ...opts,
      });
    },
    updateContent({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/content/${id}`,
        method: "PUT",
        ...opts,
      });
    },
    deleteContent({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/content/${id}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
