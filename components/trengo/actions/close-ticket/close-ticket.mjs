import app from "../../trengo.app.mjs";

export default {
  key: "trengo-close-ticket",
  name: "Close Ticket",
  description: "Close a ticket. [See the documentation](https://developers.trengo.com/reference/close-a-ticket)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    ticketResultId: {
      propDefinition: [
        app,
        "ticketResultId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.closeTicket({
      $,
      ticketId: this.ticketId,
      data: {
        ticket_result_id: this.ticketResultId,
      },
    });

    $.export("$summary", "Successfully closed ticket");

    return response;
  },
};
