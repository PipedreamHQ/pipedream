import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "keysender",
  propDefinitions: {
    databaseId: {
      type: "integer",
      label: "Database ID",
      description: "The database ID from which codes will be taken.",
      async options({ page }) {
        const databases = await this.listDatabases({
          params: {
            page,
          },
        });
        return databases?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://panel.keysender.co.uk/api/v1.0";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listDatabases(opts = {}) {
      return this._makeRequest({
        path: "/databases",
        ...opts,
      });
    },
    createTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transaction/addcustom",
        ...opts,
      });
    },
  },
};
