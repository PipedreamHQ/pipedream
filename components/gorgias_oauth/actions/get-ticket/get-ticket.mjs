import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-get-ticket",
  name: "Get Ticket",
  description: "Get a ticket. [See the documentation](https://developers.gorgias.com/reference/get-ticket)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gorgias_oauth,
    ticketId: {
      propDefinition: [
        gorgias_oauth,
        "ticketId",
      ],
      description: "The ID of a ticket to get",
    },
  },
  async run({ $ }) {
    const response = await this.gorgias_oauth.retrieveTicket({
      $,
      id: this.ticketId,
    });
    $.export("$summary", `Successfully retrieved ticket with ID: ${this.ticketId}`);
    return response;
  },
};
