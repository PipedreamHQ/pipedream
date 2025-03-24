import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "favro",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "ID of the organization",
      async options() {
        const response = await this.listOrganizations();
        const usersIds = response.entities;
        return usersIds.map(({
          organizationId, name,
        }) => ({
          value: organizationId,
          label: name,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user",
      async options({ organizationId }) {
        const response = await this.listUsers({
          organizationId,
        });
        const usersIds = response.entities;
        return usersIds.map(({
          userId, name,
        }) => ({
          value: userId,
          label: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the organization",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role of the user",
      options: constants.USER_ROLES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://favro.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.username}`,
          password: `${this.$auth.api_token}`,
        },
      });
    },
    async createOrganization(args = {}) {
      return this._makeRequest({
        path: "/v1/organizations",
        method: "post",
        ...args,
      });
    },
    async updateOrganization({
      organizationId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/organizations/${organizationId}`,
        method: "put",
        ...args,
      });
    },
    async listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/v1/organizations",
        ...args,
      });
    },
    async listUsers({
      organizationId, ...args
    }) {
      return this._makeRequest({
        path: "/v1/users",
        headers: {
          organizationId,
        },
        ...args,
      });
    },
  },
};
