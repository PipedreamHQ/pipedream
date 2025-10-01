import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-update-ticket",
  name: "Update Ticket",
  description: "Update a ticket. [See the documentation](https://api.freshservice.com/#update_ticket_priority)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshservice,
    ticketId: {
      propDefinition: [
        freshservice,
        "ticketId",
      ],
    },
    source: {
      propDefinition: [
        freshservice,
        "ticketSourceType",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        freshservice,
        "ticketStatus",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        freshservice,
        "ticketPriority",
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of a ticket",
      optional: true,
    },
    description: {
      type: "string",
      label: "Ticket Description",
      description: "The description of a ticket",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address accociated with the ticket",
      optional: true,
    },
  },
  async run({ $ }) {
    const { ticket } = await this.freshservice.updateTicket({
      $,
      ticketId: this.ticketId,
      data: {
        source: this.source,
        status: this.status,
        priority: this.priority,
        subject: this.subject,
        description: this.description,
        email: this.email,
      },
    });
    $.export("$summary", `Successfully updated ticket with ID ${ticket.id}`);
    return ticket;
  },
};
