import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "amilia",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://www.amilia.com/api/v3/en/org/" + this.$auth.organization;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      if (opts.paginate) {
        delete opts.paginate;
        return this.paginate({
          ...opts,
          path,
        });
      }

      return axios($, {
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    async listAccounts(opts = {}) {
      const path = "/accounts";
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async paginate(opts) {
      const items = [];
      let page = 1;

      while (true) {
        const response = await this._makeRequest({
          ...opts,
          params: {
            ...opts.params,
            page: page++,
          },
        });
        items.push(...response.Items);
        if (!response.Paging?.Next) {
          return items;
        }
      }
    },
  },
};
