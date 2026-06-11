import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-update-ticket-summary",
  name: "Update Ticket Summary",
  description: "Update the summary of a ticket. [See the documentation](https://developers.freshdesk.com/api/#ticket_summary)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
    summary: {
      type: "string",
      label: "Summary",
      description: "The summary content for the ticket",
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.updateTicketSummary({
      $,
      ticketId: this.ticketId,
      data: {
        summary: this.summary,
      },
    });
    response && $.export("$summary", "Successfully updated ticket summary");
    return response;
  },
};
