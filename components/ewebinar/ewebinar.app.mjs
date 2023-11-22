import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ewebinar",
  propDefinitions: {
    nextCursor: {
      type: "string",
      label: "Next Cursor",
      description: "Store and send across calls to only get updated registrants",
      optional: true,
    },
    // Additional propDefinitions can be defined here as required by the API
  },
  methods: {
    _baseUrl() {
      return "https://api.ewebinar.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        params,
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
        params,
      });
    },
    async getRegistrantSessions({ nextCursor }) {
      return this._makeRequest({
        path: "/registrants",
        params: {
          nextCursor,
        },
      });
    },
    async registerForSession(opts = {}) {
      // The API documentation for registering for a session is incomplete.
      // Assuming there's a path like '/register' and it's a POST request.
      // The actual implementation may vary based on the complete API spec.
      return this._makeRequest({
        method: "POST",
        path: "/register",
        ...opts,
      });
    },
    // Additional methods can be defined here as required by the API
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
