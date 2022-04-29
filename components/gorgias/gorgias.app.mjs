import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gorgias",
  propDefinitions: {},
  methods: {
    _auth() {
      return {
        username: `${this.$auth.email}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _defaultConfig({
      path, method = "get",
    }) {
      return {
        auth: this._auth(),
        url: `https://${this.$auth.domain}/api/${path}`,
        method,
      };
    },
    async _makeRequest({
      path, method,
    }) {
      const config = this._defaultConfig({
        path,
        method,
      });
      const { data } = await axios(this, config);
      return data;
    },
    async getEvents() {
      return this._makeRequest({
        path: "/events",
      });
    },
  },
};
