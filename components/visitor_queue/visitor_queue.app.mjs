import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "visitor_queue",
  propDefinitions: {
    dataViews: {
      type: "string",
      label: "Data Views",
      description: "The list of Data Views associated with your account.",
      async options() {
        const data = await this.listDataViews();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.api_key;
    },
    _getHeaders() {
      return {
        Authorization: `Token ${this._accessToken()}`,
      };
    },
    _apiUrl() {
      return "https://www.visitorqueue.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...options
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        ...options,
        headers: this._getHeaders(),
      };
      return axios($, config);
    },
    async *paginate({
      fn, params = {},
    }) {
      let page = 0;
      let length = 0;

      do {
        params.page = ++page;
        const items = await fn({
          params,
        });
        for (const d of items) {
          yield d;
        }
        length = items.length;
      } while (length);
    },
    async listDataViews() {
      return await this._makeRequest({
        path: "ga_views",
      });
    },
    async listLeads(args) {
      return await this._makeRequest({
        path: "leads",
        ...args,
      });
    },
  },
};
