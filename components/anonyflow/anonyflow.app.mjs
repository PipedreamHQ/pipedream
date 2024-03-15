import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anonyflow",
  propDefinitions: {
    data: {
      type: "object",
      label: "Data",
      description: "Data packet to be Anonymized or Deanonymized. Note that **only JSON Object is accepted**",
    },
    keys: {
      type: "string[]",
      label: "Keys",
      description: "Provided keys to be used for Anonymization or Deanonymization",
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.anonyflow.com${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
