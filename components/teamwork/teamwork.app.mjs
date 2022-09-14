import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamwork",
  propDefinitions: {
    tasklistId: {
      type: "string",
      label: "Tasklist Id",
      description: "Id of the tasklist to list tasks from",
      async options({ page }) {
        const tasklists = await this.listTasklists(page + 1);
        return tasklists.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return this.$auth.domain;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async listTasklists(page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/tasklists.json",
        params: {
          page,
        },
      }));
      return res?.tasklists || [];
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log((this.$auth));
    },
  },
};
