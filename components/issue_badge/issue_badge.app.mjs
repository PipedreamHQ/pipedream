import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "issue_badge",
  propDefinitions: {
    badgeId: {
      type: "string",
      label: "Badge ID",
      description: "The ID of the badge to create an issue for",
      async options() {
        const { data } = await this.listAllBadges();

        return data.map(({
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
      return "https://app.issuebadge.com/api/v1";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    createOrganization(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/organization/create",
        ...opts,
      });
    },
    listAllOrganizations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/organization/getall",
        ...opts,
      });
    },
    listAllBadges(opts = {}) {
      return this._makeRequest({
        path: "/badge/getall",
        ...opts,
      });
    },
    createBadge(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/badge/create",
        ...opts,
      });
    },
    createIssue(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/issue/create",
        ...opts,
      });
    },
  },
};
