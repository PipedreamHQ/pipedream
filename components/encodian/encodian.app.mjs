import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "encodian",
  propDefinitions: {
    primaryText: {
      type: "string",
      label: "Frist Text",
      description: "The first text for comparison",
    },
    secondaryText: {
      type: "string",
      label: "Second Text",
      description: "The second text for comparison",
    },
    ignoreCase: {
      type: "boolean",
      label: "Ignore Case",
      description: "Toggle to specify whether case should be ignored during comparison",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "An email address to check validity",
    },
    url: {
      type: "string",
      label: "URL",
      description: "An URL to check availability, e.g. `https://www.google.com`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.apps-encodian.com/api/v1";
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
          ...headers,
          "X-ApiKey": `${this.$auth.encodian_flowr_api_key}`,
        },
      });
    },
    async validateUrl(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/Utility/ValidateUrlAvailability",
        ...args,
      });
    },
    async validateEmail(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/Utility/ValidateEmailAddress",
        ...args,
      });
    },
    async compareTexts(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/Utility/CompareText",
        ...args,
      });
    },
  },
};
