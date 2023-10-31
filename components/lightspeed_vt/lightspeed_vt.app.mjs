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
        const locations = await this.listLocations();
        return locations.map((location) => ({
          label: location.name,
          value: location.id,
        }));
      },
    },
    username: {
      type: "string",
      label: "Username",
      description: "The username of the new user",
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password for the new user",
      secret: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the new user",
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
    accessLevel: {
      type: "integer",
      label: "Access Level",
      description: "The access level for the new user",
    },
  },
  methods: {
    _baseUrl() {
      return "https://webservices.lightspeedvt.net/REST/V1";
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
    async listLocations(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/locations/",
      });
    },
    async createUser(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/users/",
      });
    },
    async listUsers(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/users/",
      });
    },
  },
};
