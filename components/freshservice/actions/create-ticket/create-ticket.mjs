import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the documentation](https://api.freshservice.com/#create_ticket)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshservice,
    source: {
      propDefinition: [
        freshservice,
        "ticketSourceType",
      ],
    },
    status: {
      propDefinition: [
        freshservice,
        "ticketStatus",
      ],
    },
    priority: {
      propDefinition: [
        freshservice,
        "ticketPriority",
      ],
    },
    subject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of a ticket",
    },
    description: {
      type: "string",
      label: "Ticket Description",
      description: "The description of a ticket",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address accociated with the ticket",
    },
  },
  async run({ $ }) {
    const { ticket } = await this.freshservice.createTicket({
      $,
      data: {
        source: this.source,
        status: this.status,
        priority: this.priority,
        subject: this.subject,
        description: this.description,
        email: this.email,
      },
    });
    $.export("$summary", `Successfully created ticket with ID ${ticket.id}`);
    return ticket;
  },
};
