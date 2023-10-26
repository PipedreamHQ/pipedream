import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lightspeed_vt",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location",
      async options() {
        const locations = await this.getLocations();
        return locations.map((location) => ({
          value: location.id,
          label: location.name,
        }));
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username for the new user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address for the new user",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lightspeedvt.com";
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
    async getLocations() {
      return this._makeRequest({
        path: "/locations",
      });
    },
    async createUser({
      locationId, username, password, email,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: {
          locationId,
          username,
          password,
          email,
        },
      });
    },
  },
};
