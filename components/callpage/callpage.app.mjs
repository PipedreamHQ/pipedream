import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "callpage",
  propDefinitions: {
    widgetId: {
      type: "string",
      label: "Widget",
      description: "The widget associated with the call or SMS.",
      async options({ page }) {
        const { data } = await this.listWidgets({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });
        return data.map(({
          id: value, description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl(version = "v1") {
      return `https://core.callpage.io/api/${version}/external`;
    },
    _getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, version, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(version) + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    async createSMS(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/create",
        ...opts,
      });
    },
    async listEvents(opts = {}) {
      return this._makeRequest({
        version: "v3",
        path: "/calls/history",
        ...opts,
      });
    },
    async listWidgets(opts = {}) {
      return this._makeRequest({
        path: "/widgets/all",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;

        const { data } = await fn({
          params,
        });
        for (const d of data) {
          yield d.data;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
