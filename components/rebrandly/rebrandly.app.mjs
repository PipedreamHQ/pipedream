import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rebrandly",
  propDefinitions: {
    domain: {
      label: "Domain",
      description: "The domain to be used",
      type: "string",
      async options({ prevContext }) {
        const domains = await this.getDomains({
          params: {
            last: prevContext.lastId,
            orderBy: "createdAt",
            orderDir: "asc",
          },
        });

        return {
          options: domains.map((domain) => ({
            label: domain.fullName,
            value: domain.id,
          })),
          context: {
            lastId: domains.length > 0
              ? domains[domains.length - 1].id
              : undefined,
          },
        };
      },
    },
    linkId: {
      label: "Link Id",
      description: "The ID of the link",
      type: "string",
      async options({ prevContext }) {
        const links = await this.getLinks({
          params: {
            last: prevContext.lastId,
          },
        });

        return {
          options: links.map((link) => ({
            label: link.title ?? link.destination,
            value: link.id,
          })),
          context: {
            lastId: links.length > 0
              ? links[links.length - 1].id
              : undefined,
          },
        };
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.rebrandly.com/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async createLink(args = {}) {
      return this._makeRequest({
        path: "/links",
        method: "post",
        ...args,
      });
    },
    async updateLink({
      linkId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/links/${linkId}`,
        method: "post",
        ...args,
      });
    },
    async getDomains(args = {}) {
      return this._makeRequest({
        path: "/domains",
        ...args,
      });
    },
    async getLinks(args = {}) {
      return this._makeRequest({
        path: "/links",
        ...args,
      });
    },
  },
};
