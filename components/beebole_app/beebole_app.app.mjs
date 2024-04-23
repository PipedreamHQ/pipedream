import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "beebole_app",
  propDefinitions: {
    begda: {
      type: "string",
      label: "Start date",
      description: "Start date in ISO format (YYYY-MM-DD)",
      default: (new Date).toISOString()
        .split("T")[0],
    },
    endda: {
      type: "string",
      label: "End date",
      description: "End date in ISO format (YYYY-MM-DD)",
      default: (new Date).toISOString()
        .split("T")[0],
    },
  },
  methods: {
    _baseUrl() {
      return "https://beebole-apps.com/api/v2";
    },

    async _makeRequest(opts = {}) {
      const {
        $ = this,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        auth: {
          ...auth,
          username: `${this.$auth.api_token}`,
          password: !otherOpts.data.undoc
            ? "x"
            : "true",
        },
      });
    },
    async apiRequest(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
