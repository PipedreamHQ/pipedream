import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "accuranker",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account",
      async options() {
        const { accounts } = await this.listAccounts();
        return accounts.map((account) => ({
          label: account.name,
          value: account.id,
        }));
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options({ accountId }) {
        const { accounts } = await this.listGroups();
        const { groups } = accounts.find((account) => account.id === accountId);
        return groups?.map((group) => ({
          label: group.group_name,
          value: group.id,
        })) || [];
      },
    },
    domainId: {
      type: "string",
      label: "Domain ID",
      description: "The ID of the domain",
      async options({ page }) {
        const domains = await this.listDomains({
          params: {
            limit: DEFAULT_LIMIT,
            offset: DEFAULT_LIMIT * page,
          },
        });
        return domains?.map((domain) => ({
          label: domain.domain,
          value: domain.id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.accuranker.com/api/v4";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts/",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/overview/group_domains/",
        ...opts,
      });
    },
    listDomains(opts = {}) {
      return this._makeRequest({
        path: "/domains/",
        ...opts,
      });
    },
    createDomain(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/domain/",
        ...opts,
      });
    },
    createKeywords(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/keyword/",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
        },
      };

      let total, count = 0;
      do {
        const response = await fn(args);
        for (const item of response) {
          yield item;
          if (max && ++count >= max) {
            return count;
          }
        }
        total = response?.length;
        args.params.offset += DEFAULT_LIMIT;
      } while (total === DEFAULT_LIMIT);
    },
  },
};
