import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "timekit",
  propDefinitions: {},
  methods: {
    _auth() {
      return {
        username: "",
        password: this.$auth.api_key,
      };
    },
    _baseUrl() {
      return "https://api.timekit.io/v2";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}` + path,
        auth: this._auth(),
        headers: {
          ...opts.headers,
          "Content-Type": "application/json",
        },
      });
    },
    async makeRequestOrPaginate({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate(opts);
      }
      const response = await this._makeRequest(opts);
      return response?.data || response;
    },
    async paginate(opts = {}) {
      const data = [];
      let page = 1;
      while (true) {
        const response = await this._makeRequest({
          ...opts,
          params: {
            ...opts.params,
            page: page++,
          },
        });
        data.push(...response.data);
        if (!response.next_page_url) {
          return data;
        }
      }
    },
    async getCurrentApp(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/app",
        ...opts,
      });
    },
    async listResources(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/resources",
        ...opts,
      });
    },
    async listBookings(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/bookings",
        ...opts,
      });
    },
  },
};
