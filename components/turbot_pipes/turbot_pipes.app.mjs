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
      async options({ prevContext }) {
        const params = {};

        if (prevContext?.nextToken) params.next_token = prevContext.nextToken;

        const {
          items: orgs, next_token,
        } = await this.getOrganizations({
          params,
        });

        return {
          context: {
            nextToken: next_token,
          },
          options: orgs.data.map((org) => org.handle),
        };
      },
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
    async getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/org",
        ...args,
      });
    },
    async updateOrganization({
      orgHandle, ...args
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/org/${orgHandle}`,
        ...args,
      });
    },
    async deleteOrganization({
      orgHandle, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/org/${orgHandle}`,
        ...args,
      });
    },
  },
};
