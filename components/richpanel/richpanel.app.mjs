import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "richpanel",
  propDefinitions: {
    // Event Filters for ticket creation
    eventFilterStatus: {
      type: "string[]",
      label: "Filter by Status",
      description: "Filter emitted events by ticket status",
      optional: true,
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
      optional: true,
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
      optional: true,
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
    // Event Filters for message events
    eventFilterChannel: {
      type: "string[]",
      label: "Filter by Channel",
      description: "Filter emitted events by communication channel",
      optional: true,
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
    // Event Filters for status updates
    eventFilterDesiredStatuses: {
      type: "string[]",
      label: "Desired Statuses to Monitor",
      description: "Specify desired statuses to monitor for status updates",
      optional: true,
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
    // Props for creating a ticket
    createId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket to create",
      optional: true,
    },
    createStatus: {
      type: "string",
      label: "Status",
      description: "The status of the new ticket",
      optional: true,
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
    createCommentBody: {
      type: "string",
      label: "Comment Body",
      description: "The body of the comment for the new ticket",
      optional: true,
    },
    createCommentSenderType: {
      type: "string",
      label: "Comment Sender Type",
      description: "The sender type of the comment",
      optional: true,
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
    createViaChannel: {
      type: "string",
      label: "Via Channel",
      description: "The channel via which the ticket is created",
      optional: true,
      options: [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Aircall",
          value: "aircall",
        },
      ],
    },
    createViaSourceFrom: {
      type: "string",
      label: "Via Source From",
      description: "The source from which the ticket was created",
      optional: true,
    },
    createViaSourceTo: {
      type: "string",
      label: "Via Source To",
      description: "The source to which the ticket was created",
      optional: true,
    },
    createTags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the new ticket",
      optional: true,
    },
    // Props for adding a message to a ticket
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
    // Props for updating ticket status
    updateTicketId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket to update",
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
    // Log authentication keys
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    // Base URL for Richpanel API
    _baseUrl() {
      return "https://api.richpanel.com/v1";
    },
    // Make an HTTP request to Richpanel API
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers = {}, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-richpanel-key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    // List all tickets with optional filters
    async listTickets(opts = {}) {
      const params = {};
      if (this.eventFilterStatus) params.status = this.eventFilterStatus.join(",");
      if (this.eventFilterPriority) params.priority = this.eventFilterPriority.join(",");
      if (this.eventFilterAssignedAgent) params.assignee_id = this.eventFilterAssignedAgent.join(",");
      if (this.eventFilterChannel) params.channel = this.eventFilterChannel.join(",");
      if (this.eventFilterDesiredStatuses) params.desired_statuses = this.eventFilterDesiredStatuses.join(",");
      return this._makeRequest({
        method: "GET",
        path: "/tickets",
        params,
      });
    },
    // Create a new ticket
    async createTicket() {
      const ticketData = {};
      if (this.createStatus) ticketData.status = this.createStatus;
      if (this.createCommentBody || this.createCommentSenderType) {
        ticketData.comment = {};
        if (this.createCommentBody) ticketData.comment.body = this.createCommentBody;
        if (this.createCommentSenderType) ticketData.comment.sender_type = this.createCommentSenderType;
      }
      if (this.createViaChannel || this.createViaSourceFrom || this.createViaSourceTo) {
        ticketData.via = {};
        if (this.createViaChannel) ticketData.via.channel = this.createViaChannel;
        if (this.createViaSourceFrom || this.createViaSourceTo) {
          ticketData.via.source = {};
          if (this.createViaSourceFrom) ticketData.via.source.from = {
            address: this.createViaSourceFrom,
          };
          if (this.createViaSourceTo) ticketData.via.source.to = {
            address: this.createViaSourceTo,
          };
        }
      }
      if (this.createTags && this.createTags.length > 0) {
        ticketData.tags = this.createTags;
      }
      if (this.createId) {
        ticketData.id = this.createId;
      }
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        data: {
          ticket: ticketData,
        },
      });
    },
    // Add a message to an existing ticket
    async addMessageToTicket() {
      const {
        addMessageId, addMessageBody, addMessageSenderType,
      } = this;
      return this._makeRequest({
        method: "POST",
        path: `/tickets/${addMessageId}/comments`,
        data: {
          comment: {
            sender_type: addMessageSenderType,
            body: addMessageBody,
          },
        },
      });
    },
    // Update the status of an existing ticket
    async updateTicketStatus() {
      const {
        updateTicketId, updateStatus,
      } = this;
      return this._makeRequest({
        method: "PUT",
        path: `/tickets/${updateTicketId}`,
        data: {
          ticket: {
            status: this.updateStatus,
          },
        },
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
  version: "0.0.{{ts}}",
};
