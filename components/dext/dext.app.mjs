import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dext",
  propDefinitions: {
    client: {
      type: "string",
      label: "Client",
      description: "Identifier of a client",
      async options() {
        const clients = await this.listClients();
        return clients?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.xavier-analytics.com";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    async _makeRequest({
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
    getClient({
      clientId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/clients/${clientId}`,
        ...args,
      });
    },
    listClients(args = {}) {
      return this._makeRequest({
        path: "/clients",
        ...args,
      });
    },
    getActivityStats({
      clientId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/clients/${clientId}/activity-stats`,
        ...args,
      });
    },
  },
};
