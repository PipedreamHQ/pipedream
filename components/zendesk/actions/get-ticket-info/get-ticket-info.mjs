import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-ticket-info",
  name: "Get Ticket Info",
  description: "Retrieves information about a specific ticket. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/#show-ticket).",
  type: "action",
  version: "0.0.8",
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
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const {
      ticketId,
      customSubdomain,
    } = this;

    const response = await this.app.getTicketInfo({
      step,
      ticketId,
      customSubdomain,
    });

    step.export("$summary", `Successfully retrieved ticket with ID ${response.ticket.id}`);

    return response;
  },
};
