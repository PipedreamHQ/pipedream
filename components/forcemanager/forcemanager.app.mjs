import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "forcemanager",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Account associated with the business opportunity",
      optional: true,
      async options({ page }) {
        const accounts = await this.listAccounts({
          params: {
            page,
          },
        });
        return accounts?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    salesRepId: {
      type: "string",
      label: "Sales Rep ID",
      description: "The User associated with the Opportunity",
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page,
          },
        });
        return users?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    branchId: {
      type: "string",
      label: "Branch ID",
      description: "Branch to whom the Opportunity has been assigned",
      async options() {
        const branches = await this.listBranches();
        return branches?.map(({
          id: value, descriptionES: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    statusId: {
      type: "string",
      label: "Status ID",
      description: "Status of the Opportunity",
      async options() {
        const statuses = await this.listOpportunityStatuses();
        return statuses?.map(({
          id: value, descriptionUS: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    currencyId: {
      type: "string",
      label: "Currency ID",
      description: "Currency related to the Opportunity amount",
      optional: true,
      async options() {
        const currencies = await this.listCurrencies();
        return currencies?.map(({
          id: value, descriptionEN: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.forcemanager.com/api/v4";
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
          "Content-Type": "application/json",
          "Accept": "*/*",
          "X-Session-Key": `${this.$auth.oauth_access_token}`,
        },
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listBranches(opts = {}) {
      return this._makeRequest({
        path: "/branches",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    listActivities(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        ...opts,
      });
    },
    listCurrencies(opts = {}) {
      return this._makeRequest({
        path: "/currencies",
        ...opts,
      });
    },
    listOpportunityStatuses(opts = {}) {
      return this._makeRequest({
        path: "/opportunityStatuses",
        ...opts,
      });
    },
    createOpportunity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      let hasMore, count = 0;
      args = {
        ...args,
        params: {
          ...args.params,
          page: 0,
        },
      };
      do {
        const results = await resourceFn(args);
        for (const item of results) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = results?.length;
        args.params.page++;
      } while (hasMore);
    },
  },
};
