import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rewiser",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The folder ID for the transaction.",
      async options() {
        const folders = await this.listFolders();

        return folders.map(({
          key: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://nzkqapsaeatytqrnitpj.supabase.co/functions/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "content-type": "application/json",
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
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/get-folders",
        ...opts,
      });
    },
    getRecentTransactions(opts = {}) {
      return this._makeRequest({
        path: "/get-recent-transactions",
        ...opts,
      });
    },
    createTransaction(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_multiple_transactions",
        ...opts,
      });
    },
  },
};
