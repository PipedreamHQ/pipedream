import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "themarketer",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address",
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The subscriber's first name",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The subscriber's last name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The subscriber's phone number",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The subscriber's city",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The subscriber's country code (e.g. `US`, `RO`)",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "The subscriber's birthday in `YYYY-MM-DD` format",
      optional: true,
    },
    channels: {
      type: "string",
      label: "Channels",
      description: "Communication channels as a comma-separated list (e.g. `email,sms`)",
      optional: true,
    },
    addTags: {
      type: "string[]",
      label: "Add Tags",
      description: "Tags to assign to the subscriber",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://t.themarketer.com/api/v1";
    },
    _authParams(params) {
      const {
        rest_key: k,
        customer_id: u,
      } = this.$auth;

      return {
        k,
        u,
        ...params,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...args
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
      if (typeof response?.result === "string" && response.result.startsWith("Failed")) {
        throw new Error(response.result);
      }
      return response;
    },
    addSubscriber(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/add_subscriber",
        ...args,
      });
    },
    removeSubscriber(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/remove_subscriber",
        ...args,
      });
    },
  },
};
