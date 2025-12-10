import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-ticket-status",
  name: "Get Ticket Status",
  description: "Get a ticket status by its ID. [See the documentation](https://dev.frontapp.com/reference/get-ticket-status-by-id)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontApp,
    ticketStatusId: {
      propDefinition: [
        frontApp,
        "ticketStatusId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.getTicketStatus({
      $,
      ticketStatusId: this.ticketStatusId,
    });

    $.export("$summary", `Successfully retrieved ticket status with ID: ${this.ticketStatusId}`);
    return response;
  },
};
