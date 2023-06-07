import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "firmao",
  propDefinitions: {},
  methods: {
    _auth() {
      return {
        username: `${this.$auth.api_login}`,
        password: `${this.$auth.api_password}`,
      };
    },
    _baseUrl() {
      return `https://system.firmao.net/${this.$auth.organization_id}`;
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...args,
      });
    },
    createCustomer({
      $,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/svc/v1/customers",
        data,
      });
    },
  },
};
