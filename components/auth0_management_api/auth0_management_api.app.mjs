import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "auth0_management_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/api/v2`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createEventStream(opts = {}) {
      return this._makeRequest({
        path: "/event-streams",
        method: "POST",
        ...opts,
      });
    },
    deleteEventStream({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/event-streams/${id}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
