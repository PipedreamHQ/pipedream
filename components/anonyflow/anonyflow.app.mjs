import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "anonyflow",
  propDefinitions: {
    encryptedData: {
      type: "string",
      label: "Encrypted Data",
      description: "The data to be decrypted",
    },
    sensitiveData: {
      type: "string",
      label: "Sensitive Data",
      description: "The sensitive data to be encrypted",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.anonyflow.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, data, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });
    },
    async encryptData({ sensitiveData }) {
      return this._makeRequest({
        path: "/anony-value",
        data: {
          value: sensitiveData,
        },
      });
    },
    async decryptData({ encryptedData }) {
      return this._makeRequest({
        path: "/deanony-value",
        data: {
          value: encryptedData,
        },
      });
    },
  },
};
