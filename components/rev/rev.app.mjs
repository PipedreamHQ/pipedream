import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rev",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.rev.com/api/v1";
    },
    _auth() {
      return {
        Authorization: `Rev ${this.$auth.client_api_key}:${this.$auth.user_api_key}`,
      };
    },
    activateSandbox(d) {
      if (d != null) {
        d.sandbox_mode = true;
      }
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      this.activateSandbox(opts.params);
      this.activateSandbox(opts.data);

      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          ...this._auth(),
        },
      });
    },
    async placeOrder(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/orders",
        method: "post",
        data: {
          ...opts.data,
        },
      });
    },
    async getOrders({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getOrders,
          dataType: "orders",
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/orders",
      });
    },
    async paginate({
      fn, dataType, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        pageSize: 100,
        page: 0,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response[dataType]);
        opts.params.page++;

        if (data.length >= response.total_count) {
          return {
            data,
          };
        }
      }
    },
  },
};
