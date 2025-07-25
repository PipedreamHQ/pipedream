import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-close-ticket",
  name: "Close Ticket",
  description: "Close a ticket in Freshservice. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
  version: "0.0.1",
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
    const response = await this.freshservice.updateTicket({
      ticketId: this.ticketId,
      data: {
        status: 5, // Closed
      },
      $,
    });

    try {
      const ticketName = await this.freshservice.getTicketName(this.ticketId);
      $.export("$summary", `Successfully closed ticket "${ticketName}"`);
    } catch (error) {
      $.export("$summary", `Successfully closed ticket ${this.ticketId}`);
    }
    return response;
  },
};
