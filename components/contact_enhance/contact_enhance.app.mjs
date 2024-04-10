import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contact_enhance",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The unique identifier for the record in the Contact Enhance database",
      required: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.contactenhance.com";
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
    async getRecord({ recordId }) {
      return this._makeRequest({
        path: `/records/${recordId}`,
      });
    },
  },
};
