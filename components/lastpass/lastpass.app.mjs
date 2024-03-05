import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lastpass",
  propDefinitions: {
    userLogin: {
      type: "string",
      label: "User Login",
      description: "User login to generate a new report",
    },
    pushedSite: {
      type: "string",
      label: "Pushed Site",
      description: "Site to be pushed when a new report is generated",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user to manage group membership or to deactivate/delete account",
    },
    groupIds: {
      type: "string[]",
      label: "Group IDs",
      description: "List of group IDs for managing user group membership",
      optional: true,
    },
    userIDs: {
      type: "string[]",
      label: "User IDs",
      description: "List of user IDs to push specified sites",
      optional: true,
    },
    siteIDs: {
      type: "string[]",
      label: "Site IDs",
      description: "List of site IDs to be pushed to specified users",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lastpass.com";
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
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async generateReport({
      userLogin, pushedSite,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/report",
        data: {
          userLogin,
          pushedSite,
        },
      });
    },
    async manageUserGroup({
      userId, groupIds,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/users/${userId}/groups`,
        data: {
          groupIds,
        },
      });
    },
    async deactivateOrDeleteUser(userId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/users/${userId}`,
      });
    },
    async pushSitesToUsers({
      userIDs, siteIDs,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/push/sites",
        data: {
          userIDs,
          siteIDs,
        },
      });
    },
  },
};
