import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tubular",
  propDefinitions: {
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note about the contact",
    },
    lead: {
      type: "boolean",
      label: "Lead",
      description: "Indicates whether the contact is a lead",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tubular.io/graphql";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        headers: {
          "Authorization": `${this.$auth.api_token}`,
          ...headers,
        },
      });
    },
    async post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
