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
    agentId: {
      label: "Agent ID",
      description: "The agent ID. Example: `0rnbfcr8`",
      type: "string",
      async options({ page }) {
        const agents = await this.listAgents({
          params: {
            _page: page + 1,
          },
        });
        return agents.map((agent) => ({
          label: agent.name,
          value: agent.id,
        }));
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket. Example: `fp80688h`",
      async options({
        page, excludeClosedAndDeleted = false,
      }) {
        let tickets = await this.listTickets({
          params: {
            _page: page + 1,
          },
        });
        if (excludeClosedAndDeleted) {
          tickets = tickets.filter((ticket) => ticket.status !== "X" && ticket.status !== "L");
        }
        return tickets.map((ticket) => ({
          label: ticket.subject,
          value: ticket.id,
        }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag to add",
      async options() {
        const tags = await this.listTags();
        return tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return",
      optional: true,
      default: 1,
      min: 1,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of results to return per page",
      optional: true,
      default: 100,
      min: 1,
    },
    sortDir: {
      type: "string",
      label: "Sort Direction",
      description: "Sort direction",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Sort field",
      optional: true,
      options: [
        "importance",
        "date_created",
        "date_changed",
      ],
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "Filter as json object {\"column1\":\"value\", \"column2\":\"value\", …} or list of filters as json array [[\"column\",\"operator\",\"value\"], …]",
      optional: true,
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
    _makeRequest({
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
    getCustomers(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    getGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
    getAgent({
      agentId, ...args
    }) {
      return this._makeRequest({
        path: `/agents/${agentId}`,
        ...args,
      });
    },
    getTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    listAgents(args = {}) {
      return this._makeRequest({
        path: "/agents",
        ...args,
      });
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    listTicketMessages({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}/messages`,
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "/tags",
        ...args,
      });
    },
    updateTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        path: `/tickets/${ticketId}`,
        method: "put",
        ...args,
      });
    },
    createCustomer(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...args,
      });
    },
  },
};
