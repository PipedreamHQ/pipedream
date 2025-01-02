import { axios } from "@pipedream/platform";
import {
  COMMENT_SENDER_TYPE_OPTIONS,
  STATUS_OPTIONS,
  VIA_CHANNEL_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "richpanel",
  propDefinitions: {
    createId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket to create",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the new ticket",
      options: STATUS_OPTIONS,
    },
    commentBody: {
      type: "string",
      label: "Comment Body",
      description: "The body of the comment for the ticket",
    },
    commentSenderType: {
      type: "string",
      label: "Comment Sender Type",
      description: "The sender type of the comment",
      options: COMMENT_SENDER_TYPE_OPTIONS,
    },
    viaChannel: {
      type: "string",
      label: "Via Channel",
      description: "The channel via which the ticket is created",
      options: VIA_CHANNEL_OPTIONS,
    },
    viaSourceFrom: {
      type: "object",
      label: "Via Source From",
      description: "The object source from which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
    },
    viaSourceTo: {
      type: "object",
      label: "Via Source To",
      description: "The object source to which the ticket was created. **Examples: {\"address\": \"abc@email.com\"} or {\"id\": \"+16692668044\"}. It depends on the selected channel**.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the new ticket.",
      async options() {
        const { tag } = await this.listTags();

        return tag.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },

    eventFilterStatus: {
      type: "string[]",
      label: "Filter by Status",
      description: "Filter emitted events by ticket status",
      options: [
        {
          label: "Open",
          value: "OPEN",
        },
        {
          label: "Closed",
          value: "CLOSED",
        },
        {
          label: "Snoozed",
          value: "SNOOZED",
        },
      ],
    },
    eventFilterPriority: {
      type: "string[]",
      label: "Filter by Priority",
      description: "Filter emitted events by ticket priority",
      options: [
        {
          label: "Low",
          value: "LOW",
        },
        {
          label: "Medium",
          value: "MEDIUM",
        },
        {
          label: "High",
          value: "HIGH",
        },
      ],
    },
    eventFilterAssignedAgent: {
      type: "string[]",
      label: "Filter by Assigned Agent",
      description: "Filter emitted events by assigned agent",
      async options() {
        const tickets = await this.paginate(this.listTickets, {
          per_page: 100,
        });
        const agents = tickets.map((ticket) => ticket.assignee_id).filter(Boolean);
        const uniqueAgents = [
          ...new Set(agents),
        ];
        return uniqueAgents.map((agent) => ({
          label: agent,
          value: agent,
        }));
      },
    },
    eventFilterChannel: {
      type: "string[]",
      label: "Filter by Channel",
      description: "Filter emitted events by communication channel",
      options: [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Chat",
          value: "chat",
        },
      ],
    },
    eventFilterDesiredStatuses: {
      type: "string[]",
      label: "Desired Statuses to Monitor",
      description: "Specify desired statuses to monitor for status updates",
      options: [
        {
          label: "Open",
          value: "OPEN",
        },
        {
          label: "Pending",
          value: "PENDING",
        },
        {
          label: "Resolved",
          value: "RESOLVED",
        },
      ],
    },
    addMessageId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket to add a message to",
      async options() {
        const tickets = await this.paginate(this.listTickets, {
          per_page: 100,
        });
        return tickets.map((ticket) => ({
          label: ticket.subject || ticket.id,
          value: ticket.id,
        }));
      },
    },
    addMessageBody: {
      type: "string",
      label: "Comment Body",
      description: "Body of the comment to add",
    },
    addMessageSenderType: {
      type: "string",
      label: "Comment Sender Type",
      description: "The sender type of the comment",
      options: [
        {
          label: "Customer",
          value: "customer",
        },
        {
          label: "Operator",
          value: "operator",
        },
      ],
    },
    conversationId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket to update",
      async options({ page }) {
        const ticket = await this.listTickets({
          params: {
            page: page + 1,
          },
        });

        console.log("ticket: ", ticket);

        return ticket.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    updateStatus: {
      type: "string",
      label: "Status",
      description: "New status of the ticket",
      options: [
        {
          label: "Open",
          value: "OPEN",
        },
        {
          label: "Closed",
          value: "CLOSED",
        },
        {
          label: "Snoozed",
          value: "SNOOZED",
        },
        {
          label: "Pending",
          value: "PENDING",
        },
        {
          label: "Resolved",
          value: "RESOLVED",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.richpanel.com/v1";
    },
    _headers() {
      return {
        "x-richpanel-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };
      console.log("config: ", config);
      console.log("config: ", JSON.stringify(config));
      return axios($, config);
    },
    createTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        ...opts,
      });
    },
    listTags() {
      return this._makeRequest({
        path: "/tags",
      });
    },
    listTickets(opts = {}) {
      return this._makeRequest({
        path: "/tickets",
        opts,
      });
    },
    updateTicket({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tickets/${conversationId}`,
        ...opts,
      });
    },

    // Pagination helper method
    async paginate(fn, opts = {}) {
      let results = [];
      let page = 1;
      let perPage = opts.per_page || 30;
      while (true) {
        const response = await fn({
          ...opts,
          page,
          per_page: perPage,
        });
        if (!response || response.length === 0) break;
        results = results.concat(response);
        if (response.length < perPage) break;
        page += 1;
      }
      return results;
    },
  },
};
