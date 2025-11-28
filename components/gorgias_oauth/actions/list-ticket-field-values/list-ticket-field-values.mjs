import gorgias from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-list-ticket-field-values",
  name: "List Ticket Field Values",
  description: "List field values for a ticket. [See the documentation](https://developers.gorgias.com/reference/list-ticket-custom-fields)",
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
    const response = await this.gorgias.listTicketFieldValues({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully retrieved ${response?.data?.length ?? 0} field value${response?.data?.length === 1
      ? ""
      : "s"} for ticket ${this.ticketId}`);
    return response;
  },
};
