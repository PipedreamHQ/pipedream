import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "drimify",
  propDefinitions: {
    applicationId: {
      type: "string[]",
      label: "Application ID",
      description: "A list of application's IDs",
      async options() {
        const data = await this.listApps();

        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://endpoint.drimify.com/api";
    },
    _headers() {
      return {
        "X-AUTH-TOKEN": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listApps() {
      return this._makeRequest({
        path: "/apps",
      });
    },
    listAppDataCollections(opts = {}) {
      return this._makeRequest({
        path: "/app_data_collections",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
