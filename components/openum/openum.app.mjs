import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openum",
  propDefinitions: {
    configId: {
      type: "string",
      label: "Config ID",
      description: "Numerical ID of the configuration.",
      async options() {
        const { config } = await this.getConfigList({
          data: {
            request: "GET_CONFIG_LIST",
            user: this.getUsername(),
            status: "enabled",
          },
        });
        return config
          .map(({
            config_id: value, name,
          }) => ({
            label: name || value,
            value,
          }));
      },
    },
  },
  methods: {
    getUsername() {
      return this.$auth.username;
    },
    _baseUrl() {
      return "https://api.lleida.net/cs/v1";
    },
    _headers() {
      return {
        "Authorization": `x-api-key ${this.$auth.api_key}`,
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getConfigList(opts = {}) {
      return this._makeRequest({
        path: "/get_config_list",
        method: "POST",
        ...opts,
      });
    },
    startSignature(opts = {}) {
      return this._makeRequest({
        path: "/start_signature",
        method: "POST",
        ...opts,
      });
    },
  },
};
