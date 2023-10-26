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
    userName: {
      type: "string",
      label: "Username",
      description: "The username for the new user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the new user",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the new user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new user",
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getLocations() {
      return this._makeRequest({
        path: "/locations",
      });
    },
    async createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: opts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
