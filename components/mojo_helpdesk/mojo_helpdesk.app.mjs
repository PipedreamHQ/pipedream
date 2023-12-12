import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mojo_helpdesk",
  propDefinitions: {
    ticketQueueId: {
      type: "string",
      label: "Ticket Queue",
      description: "The ticket queue where the new ticket will be placed",
      async options({ page }) {
        const queues = await this.listTicketQueues({
          params: {
            page,
          },
        });
        return queues?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "The user to assign to the new ticket",
      optional: true,
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page,
          },
        });
        return users?.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          label: firstName || lastName
            ? `${firstName || ""} ${lastName || ""}`
            : `User ID: ${id}`,
          value: id,
        })) || [];
      },
    },
    priorityId: {
      type: "string",
      label: "Priority",
      description: "Priority level of the ticket",
      optional: true,
      options: constants.TICKET_PRIORITY_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.mojohelpdesk.com/api/v2";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: {
          ...params,
          access_key: this.$auth.access_key,
        },
        ...args,
      };
      return axios($, config);
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listTicketQueues(args = {}) {
      return this._makeRequest({
        path: "/ticket_queues",
        ...args,
      });
    },
    searchTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets/search",
        ...args,
      });
    },
    createTicket(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        method: "POST",
        ...args,
      });
    },
    createUser(args = {}) {
      return this._makeRequest({
        path: "/users",
        method: "POST",
        ...args,
      });
    },
  },
};
