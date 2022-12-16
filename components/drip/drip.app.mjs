import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "drip",
  propDefinitions: {},
  methods: {
    _apiUrl() {
      return "https://api.getdrip.com/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    async activateWorkflow({
      $, workflowId,
    }) {
      const accountId = await this.getAccountId();
      return this._makeRequest({
        $,
        path: `${accountId}/workflows/${workflowId}/activate`,
        method: "POST",
      });
    },
    async createOrUpdateSubscriber({
      $, ...opts
    }) {
      const accountId = await this.getAccountId();
      return this._makeRequest({
        $,
        path: `${accountId}/subscribers`,
        method: "POST",
        ...opts,
      });
    },
    async createHook(data) {
      const accountId = await this.getAccountId();
      return await this._makeRequest({
        method: "POST",
        path: `${accountId}/webhooks`,
        data,
      });
    },
    async deleteHook(hookId) {
      const accountId = await this.getAccountId();
      return await this._makeRequest({
        method: "DELETE",
        path: `${accountId}/webhooks/${hookId}`,
      });
    },
    async getAccountId() {
      const { accounts } = await this.listAccounts();
      return accounts[0].id;
    },
    listAccounts() {
      return this._makeRequest({
        path: "accounts",
      });
    },
    async listSubscribers({ ...opts }) {
      const accountId = await this.getAccountId();
      return this._makeRequest({
        path: `${accountId}/subscribers`,
        ...opts,
      });
    },
    async listTags({ ...opts }) {
      const accountId = await this.getAccountId();
      return this._makeRequest({
        path: `${accountId}/tags`,
        ...opts,
      });
    },
    async listWorkflows({ ...opts }) {
      const accountId = await this.getAccountId();
      return this._makeRequest({
        path: `${accountId}/workflows`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          meta: {
            current_page, last_page,
          },
        } = await fn(params);
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(current_page == last_page);

      } while (lastPage);
    },
  },
};
