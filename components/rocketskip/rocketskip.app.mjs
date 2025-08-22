import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rocketskip",
  propDefinitions: {
    streetAddress: {
      type: "string",
      label: "Street Address",
      description: "Street address of the property, i.e.: `44 Montgomery St`",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the property, i.e.: `San Francisco`",
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the property, i.e.: `CA`",
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "Postal code of the property, i.e.: `94108`",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the property owner",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the property owner",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rocketskip.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
      });
    },

    async skipTraceProperty(args = {}) {
      return this._makeRequest({
        path: "/property/skiptrace",
        method: "post",
        ...args,
      });
    },
  },
};
