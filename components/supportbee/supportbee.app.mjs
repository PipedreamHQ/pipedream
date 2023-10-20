import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "supportbee",
  propDefinitions: {
    ticketId: {
      label: "Ticket ID",
      description: "The ticket ID",
      type: "string",
      async options({ page }) {
        const tickets = await this.getTickets({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });

        return tickets.map((ticket) => ({
          label: ticket.subject,
          value: ticket.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _domain() {
      return this.$auth.domain;
    },
    _apiUrl() {
      return `https://${this._domain()}.supportbee.com`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        ...args,
        params: {
          auth_token: this._apiToken(),
          ...args.params,
        },
      });
    },
    async getTickets(args = {}) {
      const response = await this._makeRequest({
        path: "/tickets",
        ...args,
      });

      return response.tickets ?? [];
    },
    async getTicketComments({
      ticketId, ...args
    } = {}) {
      const response = await this._makeRequest({
        path: `/tickets/${ticketId}/comments`,
        ...args,
      });

      return response.comments ?? [];
    },
    async createTicket(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        method: "post",
        ...args,
      });
    },
  },
};
