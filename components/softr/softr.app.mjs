import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "softr",
  propDefinitions: {
    appName: {
      type: "string",
      label: "App Name",
      description: "The name of the Softr app",
    },
    userInfo: {
      type: "object",
      label: "User Information",
      description: "Information about the user to be created",
    },
    userRole: {
      type: "string",
      label: "User Role",
      description: "The role of the user within the app",
      optional: true,
    },
    accessPermissions: {
      type: "string",
      label: "Access Permissions",
      description: "The access permissions for the user within the app",
      optional: true,
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user to be removed",
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The name of the Softr.io domain to which the user will be added",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.softr.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createUser({
      appName, userInfo, userRole, accessPermissions,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/apps/${appName}/users`,
        data: {
          userInfo,
          userRole,
          accessPermissions,
        },
      });
    },
    async removeUser({
      appName, userId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/apps/${appName}/users/${userId}`,
      });
    },
    async addUserToDomain({
      domainName, userInfo,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/domains/${domainName}/users`,
        data: userInfo,
      });
    },
  },
};
