import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "white_swan",
  propDefinitions: {
    clientEmail: {
      type: "string",
      label: "Client Email",
      description: "Email of the client to retrieve information",
      async options() {
        const clients = await this.getClients();
        return clients?.map(({
          email: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.whiteswan.io/api/1.1/wf";
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
    },
    getClients(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/client",
        ...opts,
      });
    },
    listPersonalPlans(opts = {}) {
      return this._makeRequest({
        path: "/personal_plan",
        method: "POST",
        ...opts,
      });
    },
    listEarningsEvents(opts = {}) {
      return this._makeRequest({
        path: "/earnings_event",
        method: "POST",
        ...opts,
      });
    },
    importClientData(opts = {}) {
      return this._makeRequest({
        path: "/new_prefill_info",
        method: "POST",
        ...opts,
      });
    },
    createQuoteRequest(opts = {}) {
      return this._makeRequest({
        path: "/complete_request",
        method: "POST",
        ...opts,
      });
    },
  },
};
