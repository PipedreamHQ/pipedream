import get from "lodash/get.js";
import retry from "async-retry";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "amilia",
  propDefinitions: {
    account: {
      type: "string",
      label: "Account",
      description: "An account in the organization.",
      async options({ page }) {
        const { Items: accounts } = await this.listAccounts({
          params: {
            page: ++page,
            perPage: constants.DEFAULT_PER_PAGE,
          },
        });
        return accounts.map((account) => ({
          label: this.getAccountName(account),
          value: account.Id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.amilia.com/api/v3/en/org/" + this.$auth.organization;
    },
    _isRetriableStatusCode(statusCode) {
      return [
        408,
        429,
        500,
      ].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 3,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 1500,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, [
            "response",
            "status",
          ]);
          if (!this._isRetriableStatusCode(statusCode)) {
            if (err.result) {
              bail(`
                Error processing request (result: ${err.result}):
              ${JSON.stringify(err.error)}
            `);
            } else {
              bail(`
                Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.message)}
            `);
              console.warn(`Temporary error: ${err.error}`);
            }
          }
          throw err;
        }
      }, retryOpts);
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
    async createWebhook(opts = {}) {
      const path = "/webhooks";
      const method = "POST";
      return this._withRetries(() => {
        return this._makeRequest({
          ...opts,
          path,
          method,
        });
      });
    },
    async deleteWebhook({
      id, ...opts
    }) {
      const path = `/webhooks/${id}`;
      const method = "DELETE";
      return this._makeRequest({
        ...opts,
        path,
        method,
      });
    },
    async listAccounts(opts = {}) {
      const path = "/accounts";
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    async getAccount({
      account, ...opts
    }) {
      const path = `/accounts/${account}`;
      return this._makeRequest({
        ...opts,
        path,
      });
    },
    getAccountName(account) {
      return account.Owners[0].AccountOwnerFullName;
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
