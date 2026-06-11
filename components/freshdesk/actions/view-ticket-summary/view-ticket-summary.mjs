import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-view-ticket-summary",
  name: "View Ticket Summary",
  description: "View the summary of a ticket. [See the documentation](https://developers.freshdesk.com/api/#ticket_summary)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshdesk,
    ticketId: {
      propDefinition: [
        freshdesk,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.getTicketSummary({
      $,
      ticketId: this.ticketId,
    });
    response && $.export("$summary", "Successfully retrieved ticket summary");
    return response;
  },
};
