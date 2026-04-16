import app from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-get-ticket",
  name: "Get Ticket",
  description: "Retrieves details of a specific ticket. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Tickets/getServiceTicketsById)",
  version: "0.0.1",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to return. E.g., `id,summary,status,company`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ticketId,
      fields,
    } = this;

    const response = await app.getTicket({
      $,
      ticketId,
      params: {
        fields,
      },
    });

    $.export("$summary", `Successfully retrieved ticket with ID \`${ticketId}\``);
    return response;
  },
};
