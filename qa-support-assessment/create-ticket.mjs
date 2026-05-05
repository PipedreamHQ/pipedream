import { axios } from "@pipedream/platform";

export default {
  key: "zendesk-create-ticket",
  name: "Create Ticket",
  description: "Creates a ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#create-ticket).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true, // should be false
  },
  props: {
    zendesk: {
      type: "app",
      app: "zendesk",
    },
    ticketCommentBody: {
      type: "string",
      label: "Comment Body",
      description: "The body of the comment",
    },
    ticketPriority: {
      type: "string",
      label: "Ticket Priority",
      description: "The priority of the ticket",
      optional: true,
      options: [
        "urgent",
        "high",
        "normal",
        "low",
      ],
    },
    ticketSubject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of the ticket",
      optional: true,
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "The status of the ticket",
      optional: true,
      options: [
        "new",
        "open",
        "pending",
        "hold",
        "solved",
        "closed",
      ],
    },
  },
  methods: {
    createTicket({
      $, ...args
    }) {
      return axios($, {
        baseURL: `https://${this.zendesk.$auth.subdomain}.zendesk.com`,
        url: "/api/v2/tickets",
        // method should be POST
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.zendesk.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createTicket({
      $,
      data: {
        ticket: {
          // body should be in comment object
          /*comment: {
            body: this.ticketCommentBody,
          },*/
          body: this.ticketCommentBody,
          priority: this.ticketPriority,
          subject: this.subject, // should be this.ticketSubject
          status: this.ticketStatus,
        },
      },
    });

    $.export("$summary", `Successfully created ticket with ID ${response.ticket.id}`);

    return response;
  },
};
