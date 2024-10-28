import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gainsight_nxt",
  propDefinitions: {
    customObjectFields: {
      type: "string[]",
      label: "Custom Object Fields",
      description: "An array of JSON strings representing custom object elements. Include a 'name' field to identify the custom object.",
    },
    personFields: {
      type: "string[]",
      label: "Person Fields",
      description: "An array of JSON strings representing person information. Include an 'email' field to identify the person.",
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.customer_domain}/v1`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers = {},
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "content-type": "application/json",
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "accesskey": `${this.$auth.access_key}`,
          ...headers,
        },
      });
    },
    async updateCompany(args) {
      return this._makeRequest({
        path: "/data/objects/Company",
        method: "PUT",
        params: {
          keys: "Name",
        },
        ...args,
      });
    },
    async createCompany(args) {
      return this._makeRequest({
        path: "/data/objects/Company",
        method: "POST",
        ...args,
      });
    },
    async createOrUpdatePerson(args) {
      return this._makeRequest({
        path: "/peoplemgmt/v1.0/people",
        method: "PUT",
        ...args,
      });
    },
  },
};
