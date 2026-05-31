import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-delete-ticket-summary",
  name: "Delete Ticket Summary",
  description: "Delete the summary note for a ticket. [See the documentation](https://developers.freshdesk.com/api/#ticket_summary)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    await this.freshdesk.deleteTicketSummary({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully deleted summary for ticket ${this.ticketId}`);
    return {
      success: true,
    };
  },
};
