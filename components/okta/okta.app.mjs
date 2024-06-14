import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "okta",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the user.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the user.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user.",
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login for the user (optional).",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The mobile phone number of the user (optional).",
      optional: true,
    },
    updateDetails: {
      type: "object",
      label: "Update Details",
      description: "The details to update for the user.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://your-domain.okta.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `SSWS ${this.$auth.api_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    async createUser({
      firstName, lastName, email, login, mobilePhone,
    }) {
      const user = {
        profile: {
          firstName,
          lastName,
          email,
          login: login || email,
          mobilePhone,
        },
        credentials: {
          password: {
            value: "TempP@ssw0rd!",
          },
        },
      };
      return this._makeRequest({
        method: "POST",
        path: "/users?activate=true",
        data: user,
      });
    },
    async fetchUser(userId) {
      return this._makeRequest({
        method: "GET",
        path: `/users/${userId}`,
      });
    },
    async updateUser(userId, updateDetails) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}`,
        data: updateDetails,
      });
    },
  },
};
