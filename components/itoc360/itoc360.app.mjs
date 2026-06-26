import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "itoc360",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.itoc360.app/functions/v1/events";
    },
    async sendEvent({
      sourceToken, data, ...opts
    }) {
      return axios(opts.$ ?? this, {
        method: "POST",
        url: this._baseUrl(),
        params: {
          token: sourceToken,
        },
        headers: {
          "content-type": "application/json",
        },
        data,
        ...opts,
      });
    },
  },
};