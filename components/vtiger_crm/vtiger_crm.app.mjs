import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vtiger_crm",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return `https://${this.$auth.instance}.vtiger.com/restapi/v1/vtiger/default`;
    },
    _getAuth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.access_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._getAuth(),
        ...args,
      });
    },
    getSync(args = {}) {
      return this._makeRequest({
        path: "/sync",
        ...args,
      });
    },
  },
};
