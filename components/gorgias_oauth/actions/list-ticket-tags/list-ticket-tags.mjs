import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-list-ticket-tags",
  name: "List Ticket Tags",
  description: "List tags for a ticket. [See the documentation](https://developers.gorgias.com/reference/get_api-tickets-ticket-id-tags)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gorgias,
    ticketId: {
      propDefinition: [
        gorgias,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gorgias.listTicketTags({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully retrieved ${response?.data?.length ?? 0} tag${response?.data?.length === 1
      ? ""
      : "s"} for ticket ${this.ticketId}`);
    return response;
  },
};
