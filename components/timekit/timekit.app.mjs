import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "./sources/common/constants.mjs";

export default {
  type: "app",
  app: "timekit",
  propDefinitions: {
    graph: {
      type: "string",
      label: "Graph Type",
      description: "Graph type according to [this link](https://help.timekit.io/en/articles/1389944-introduction-to-booking-graphs)",
      options: constants.graphs,
    },
    state: {
      type: "string",
      label: "Booking State",
      async options({ graph }) {
        if (graph === "instant") return constants.states.INSTANT;
        if (graph === "instant_payment") return constants.states.INSTANT_PAYMENT;
        if (graph === "confirm_decline") return constants.states.CONFIRM_DECLINE;
        if (graph === "group_owner") return constants.states.GROUP_OWNER;
        if (graph === "group_customer") return constants.states.GROUP_CUSTOMER;
        if (graph === "group_customer_payment") return constants.states.GROUP_CUSTOMER_PAYMENT;
        if (graph === "reservation") return constants.states.RESERVATION;
        throw new ConfigurationError(`Graph type **${graph}** is not supported`);
      },
    },
  },
  methods: {
    _auth() {
      return {
        username: "",
        password: this.$auth.api_key,
      };
    },
    _baseUrl() {
      return "https://api.timekit.io/v2";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}` + path,
        auth: this._auth(),
        headers: {
          ...opts.headers,
          "Content-Type": "application/json",
        },
      });
    },
    async makeRequestOrPaginate({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate(opts);
      }
      const response = await this._makeRequest(opts);
      return response?.data || response;
    },
    async paginate(opts = {}) {
      const data = [];
      let page = 1;
      while (true) {
        const response = await this._makeRequest({
          ...opts,
          params: {
            ...opts.params,
            page: page++,
          },
        });
        data.push(...response.data);
        if (!response.next_page_url) {
          return data;
        }
      }
    },
    async createWebhook(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/webhooks",
        method: "post",
        ...opts,
      });
    },
    async deleteWebhook({
      id, ...opts
    }) {
      return this.makeRequestOrPaginate({
        path: `/webhooks/${id}`,
        method: "delete",
        ...opts,
      });
    },
    async getCurrentApp(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/app",
        ...opts,
      });
    },
    async getProject({
      id, ...opts
    }) {
      return this.makeRequestOrPaginate({
        path: `/projects/${id}`,
        ...opts,
      });
    },
    async listProjects(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/projects",
        ...opts,
      });
    },
    async listResources(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/resources",
        ...opts,
      });
    },
    async listBookings(opts = {}) {
      return this.makeRequestOrPaginate({
        path: "/bookings",
        ...opts,
      });
    },
  },
};
