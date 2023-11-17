import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "knorish",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const users = await this.getUsers({
          page,
        });
        return {
          options: users.map((user) => ({
            label: user.name,
            value: user.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    bundleId: {
      type: "string",
      label: "Bundle ID",
      description: "The ID of the bundle",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const bundles = await this.getBundles({
          page,
        });
        return {
          options: bundles.map((bundle) => ({
            label: bundle.title,
            value: bundle.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    newUserDetails: {
      type: "object",
      label: "New User Details",
      description: "The details of the new user to create",
    },
    addUserToBundleDetails: {
      type: "object",
      label: "Add User to Bundle Details",
      description: "The details for adding a user to a specific bundle",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.knorish.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-App-Id": `${this.$auth.app_id}`,
          "X-App-Key": `${this.$auth.app_key}`,
        },
        data,
        params,
      });
    },
    async getUsers(opts = {}) {
      return this._makeRequest({
        path: "/v1/users",
        ...opts,
      });
    },
    async getBundles(opts = {}) {
      return this._makeRequest({
        path: "/v1/bundles",
        ...opts,
      });
    },
    async createUser(userDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/user",
        data: userDetails,
      });
    },
    async addUserToBundle(details) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/user/bundle",
        data: details,
      });
    },
    // Additional methods to handle new signups and bundle purchases would be
    // defined here. However, these would typically be implemented in a source
    // component, using methods like `getUsers` and `getBundles` to check for new
    // signups or purchases.
  },
};
