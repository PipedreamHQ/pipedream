import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dub",
  propDefinitions: {
    projectSlug: {
      type: "string",
      label: "Project Slug",
      description: "The project slug",
      async options() {
        const resources = await this.getProjects();

        return resources.map(({
          slug, name,
        }) => ({
          label: name,
          value: slug,
        }));
      },
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The link id",
      async options({ projectSlug }) {
        const resources = await this.getLinks({
          params: {
            projectSlug,
          },
        });

        return resources.map(({
          id, domain,
        }) => ({
          label: domain,
          value: id,
        }));
      },
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the short link",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The destination URL of the short link",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password required to access the destination URL of the short link",
      optional: true,
    },
    publicStats: {
      type: "boolean",
      label: "Public Stats",
      description: "Whether the short link's stats are publicly accessible",
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "The comments for the short link",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.dub.co";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async createLink(args = {}) {
      const response = await this._makeRequest({
        path: "/links",
        method: "post",
        ...args,
      });

      return response.subscriptions;
    },
    async updateLink({
      linkId, ...args
    }) {
      const response = await this._makeRequest({
        path: `/links/${linkId}`,
        method: "put",
        ...args,
      });

      return response.subscriptions;
    },
    async deleteLink({
      linkId, ...args
    }) {
      const response = await this._makeRequest({
        path: `/links/${linkId}`,
        method: "delete",
        ...args,
      });

      return response.subscriptions;
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
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
