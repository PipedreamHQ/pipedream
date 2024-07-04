import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "_21risk",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.21risk.com/v5";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitNewActionEvent(opts = {}) {
      return this._makeRequest({
        path: "/actions",
        ...opts,
      });
    },
    async emitNewAuditorEvent(opts = {}) {
      return this._makeRequest({
        path: "/auditors",
        ...opts,
      });
    },
    async emitNewReportEvent(opts = {}) {
      return this._makeRequest({
        path: "/reports",
        ...opts,
      });
    },
    async paginate(fn, opts = {}) {
      let results = [];
      let response;
      do {
        response = await fn(opts);
        results = results.concat(response.value);
        opts.params = {
          ...opts.params,
          $skiptoken: response["@odata.nextLink"],
        };
      } while (response["@odata.nextLink"]);
      return results;
    },
  },
};
