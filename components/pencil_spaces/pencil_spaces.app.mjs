import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pencil_spaces",
  propDefinitions: {
    spaceToCloneId: {
      type: "string",
      label: "Space To Clone Id",
      description: "The space ID of the Space you want to clone. You may only clone Spaces that are templates, Spaces for which you are a host, and Spaces which you can access as an admin due to your institution settings.",
      async options({ page }) {
        const { results } = await this.listSpaces({
          params: {
            pageNumber: page + 1,
          },
        });

        return results.map(({
          spaceId: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ownerId: {
      type: "string",
      label: "Owner Id",
      description: "The ID of the user who will be the owner of the space. If not provided, the current user will be the owner.",
      async options({ page }) {
        const { results } = await this.listUsers({
          params: {
            pageNumber: page + 1,
          },
        });

        return results.map(({
          userId: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    siteId: {
      type: "string",
      label: "Site Id",
      description: "The ID of the site you want to create the Space in.",
      async options() {
        const { results } = await this.listSites();

        return results.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listSpaces(opts = {}) {
      return this._makeRequest({
        path: "spaces",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "users",
        ...opts,
      });
    },
    listSites(opts = {}) {
      return this._makeRequest({
        path: "sites",
        ...opts,
      });
    },
    createSpace(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "spaces/create",
        ...opts,
      });
    },
  },
};
