import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffy",
  propDefinitions: {
    ticketDetails: {
      type: "object",
      label: "Ticket Details",
      description: "The details of the bug-tracking ticket to be monitored for creation.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.diffy.website/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createTicket(ticketDetails) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: ticketDetails,
      });
    },
    async getTicketInfo(ticketId) {
      return this._makeRequest({
        path: `/projects/${ticketId}`,
      });
    },
    async updateTicket(ticketId, ticketDetails) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${ticketId}`,
        data: ticketDetails,
      });
    },
    async deleteTicket(ticketId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/projects/${ticketId}`,
      });
    },
  },
};
