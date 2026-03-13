import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-ticket",
  name: "Get Ticket",
  description: "Get a specific ticket. [See the documentation](https://developers.trengo.com/reference)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTicket({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully retrieved ticket with ID: ${this.ticketId}`);
    return response;
  },
};
