import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "callrail",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account you wish to use",
      async options({ page }) {
        const { accounts } = await this.listAccounts({
          params: {
            page: page + 1,
          },
        });
        return accounts.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company you wish to use",
      async options({
        accountId, page,
      }) {
        const { companies } = await this.listCompanies({
          accountId,
          params: {
            page: page + 1,
          },
        });
        return companies.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.callrail.com/v3/a";
    },
    _headers() {
      return {
        "Authorization": `Token token=${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: ".json",
        ...args,
      });
    },
    listCompanies({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/companies.json`,
        ...args,
      });
    },
    listIntegrations({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/integrations.json`,
        ...args,
      });
    },
    createHook({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${accountId}/integrations.json`,
        ...args,
      });
    },
    updateHook({
      accountId,
      integrationId,
      ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/${accountId}/integrations/${integrationId}.json`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, dataField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          [dataField]: data,
          page: aPage,
          total_pages: tPages,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = aPage < tPages;

      } while (hasMore);
    },
  },
};
