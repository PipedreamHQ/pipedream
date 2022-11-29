import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "envoy",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
      console.log(this.$auth);
    },
    _getBaseUrl() {
      return "https://api.envoy.com/v1";
    },
    _getHeaders() {
      this.authKeys();
      return {
        "content-type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listInvites(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/invites",
        params: params,
      }));
      return result;
    },
    async listAllEntriesPages(ctx = this, params) {
      let entriesResult = null;
      const entriesArray = [];
      do {
        const currPage = entriesResult?.meta?.page || 0;
        entriesResult = await this.listEntries(ctx, {
          ...params,
          page: currPage + 1,
        });
        entriesArray.push(...entriesResult.data);
      } while (!entriesResult || entriesResult.meta.perPage > entriesResult.meta.total);
      return entriesArray;
    },
    async listEntries(ctx = this, params) {
      const result = await axios(ctx, this._getRequestParams({
        method: "GET",
        path: "/entries",
        params: params,
      }));
      return result;
    },
  },
};
