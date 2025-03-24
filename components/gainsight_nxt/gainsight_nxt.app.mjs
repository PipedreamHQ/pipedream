import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gainsight_nxt",
  propDefinitions: {
    objectName: {
      type: "string",
      label: "Custom Object",
      description: "The name of the custom object.",
      async options() {
        const { data } = await this.listCustomObjects();
        return data?.filter?.((obj) => obj.objectType === "CUSTOM").map(( {
          label, objectName,
        }) => ({
          label,
          value: objectName,
        }));
      },
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
    async listCustomObjects() {
      return this._makeRequest({
        path: "/meta/services/objects/list",
      });
    },
    async updateCustomObject({
      objectName, ...args
    }) {
      return this._makeRequest({
        path: `/data/objects/${objectName}`,
        method: "PUT",
        ...args,
      });
    },
    async createCustomObject({
      objectName, ...args
    }) {
      return this._makeRequest({
        path: `/data/objects/${objectName}`,
        method: "POST",
        ...args,
      });
    },
  },
};
