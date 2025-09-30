import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-get-ticket",
  name: "Get Ticket",
  description: "Get a ticket by ID. [See the documentation](https://api.freshservice.com/#view_a_ticket)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const { ticket } = await this.freshservice.getTicket({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully fetched ticket with ID ${ticket.id}`);
    return ticket;
  },
};
