import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "epsy",
  propDefinitions: {
    value: {
      type: "string",
      label: "Value",
      description: "Value to lookup",
    },
    searchId: {
      type: "string",
      label: "Search ID",
      description: "ID of the search",
      async options() {
        const searchIds = await this.getSearchIds();
        return searchIds.map(({
          id, type,
        }) => ({
          label: type,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://irbis.espysys.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "accept": "application/json",
          "content-type": "application/json",
        },
        params: {
          ...params,
          key: `${this.$auth.api_key}`,
        },
      });
    },
    async emailLookup(args = {}) {
      return this._makeRequest({
        path: "/developer/combined_email",
        method: "post",
        ...args,
      });
    },
    async nameLookup(args = {}) {
      return this._makeRequest({
        path: "/developer/combined_name",
        method: "post",
        ...args,
      });
    },
    async getLookupResults({
      searchId, ...args
    }) {
      return this._makeRequest({
        path: `/request-monitor/api-usage/${searchId}`,
        ...args,
      });
    },
    async getSearchIds(args = {}) {
      return this._makeRequest({
        path: "/request-monitor/api-usage",
        ...args,
      });
    },
  },
};
