import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "turbot_pipes",
  propDefinitions: {
    handle: {
      type: "string",
      label: "Handle",
      description: "New handle of the user",
    },
    orgHandle: {
      type: "string",
      label: "Organization Handle",
      description: "Handle of the organization",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "Display name of the organization",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL of the organization",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://pipes.turbot.com/api/v0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.token}`,
        },
      });
    },
    async createOrganization(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/org",
        ...args,
      });
    },
    async updateOrganization({
      org_handle, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/org/${org_handle}`,
        ...args,
      });
    },
    async deleteOrganization({
      org_handle, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/org/${org_handle}`,
        ...args,
      });
    },
  },
};
