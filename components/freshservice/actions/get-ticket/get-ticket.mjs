import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-get-ticket",
  name: "Get Ticket",
  description: "Get details of a ticket in Freshservice. [See the documentation](https://api.freshservice.com/v2/#view_ticket)",
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
    const response = await this.freshservice.getTicket({
      ticketId: this.ticketId,
      $,
    });

    $.export("$summary", `Successfully retrieved ticket: ${response.ticket?.subject || this.ticketId}`);
    return response;
  },
};