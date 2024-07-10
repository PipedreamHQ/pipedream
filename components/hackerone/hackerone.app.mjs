import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "hackerone",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the organization",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the invitee",
    },
    organizationAdmin: {
      type: "boolean",
      label: "Organization Admin",
      description: "Sets the invitee as an organization admin",
    },
    permissions: {
      type: "string[]",
      label: "Permissions",
      description: "The permissions added to the new organization group",
      options: constants.PERMISSIONS,
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "ID of the organization",
      async options() {
        const { data: organizationsIDs } = await this.getOrganizations();

        return organizationsIDs.map(({ id }) => ({
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hackerone.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          ...auth,
          username: `${this.$auth.api_token_identifier}`,
          password: `${this.$auth.api_token}`,
        },
      });
    },
    async createInvitation({
      organizationId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/organizations/${organizationId}/invitations`,
        ...args,
      });
    },
    async createGroup({
      organizationId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/organizations/${organizationId}/groups`,
        ...args,
      });
    },
    async getOrganizations(args = {}) {
      return this._makeRequest({
        path: "/me/organizations",
        ...args,
      });
    },
    async getMembers({
      organizationId, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${organizationId}/members`,
        ...args,
      });
    },
  },
};
