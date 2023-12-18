import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "linkly",
  propDefinitions: {
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID of the Linkly link",
      required: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to shorten",
      required: true,
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "The alias for the shortened URL",
      required: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title for the shortened URL",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description for the shortened URL",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.linklyhq.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getLink(opts) {
      return this._makeRequest({
        ...opts,
        path: `/link/${opts.linkId}`,
      });
    },
    async createLink(opts) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/link",
        data: {
          url: opts.url,
          alias: opts.alias,
          title: opts.title,
          description: opts.description,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
