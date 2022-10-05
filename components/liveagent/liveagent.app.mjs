import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "liveagent",
  propDefinitions: {
    groupId: {
      label: "Group ID",
      description: "The group ID",
      type: "string",
      async options({ page }) {
        const groups = await this.getGroups({
          params: {
            _page: page + 1,
          },
        });

        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
  },
  methods: {
    _domain() {
      return this.$auth.domain;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://${this._domain()}.ladesk.com/api/v3`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        headers: {
          apikey: this._apiKey(),
        },
      });
    },
    async getCustomers(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async getGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    async createCustomer(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...args,
      });
    },
  },
};
