import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "skillzrun",
  propDefinitions: {
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email of the user. This is required and must be unique.",
      required: true,
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The name of the user. This is optional.",
      optional: true,
    },
    offerIds: {
      type: "string[]",
      label: "Offer IDs",
      description: "The IDs of the associated offers. These must exist within the SkillzRun app.",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.skillzrun.com/external/api";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createUser({
      userEmail, userName = "",
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users/",
        data: {
          email: userEmail,
          name: userName,
        },
      });
    },
    async updateUser({
      userEmail, userName = "",
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/users/${userEmail}`,
        data: {
          email: userEmail,
          name: userName,
        },
      });
    },
    async createUserWithOffers({
      userEmail, offerIds, userName = "",
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users/create-with-orders",
        data: {
          email: userEmail,
          offers: offerIds,
          name: userName,
        },
      });
    },
    async emitNewUserEvent() {
      return this.$emit({
        id: "newUserCreated",
      }, {
        summary: "New user created in SkillzRun App",
      });
    },
  },
};
