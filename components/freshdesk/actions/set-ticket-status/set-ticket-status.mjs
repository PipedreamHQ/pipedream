import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-set-ticket-status",
  name: "Set Ticket Status",
  description: "Update the status of a ticket in Freshdesk  [See the documentation](https://developers.freshdesk.com/api/#update_ticket).",
  version: "0.0.5",
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
    ticketStatus: {
      propDefinition: [
        freshdesk,
        "ticketStatus",
      ],
    },
  },
  async run({ $ }) {

    const ticketName = await this.freshdesk.getTicketName(this.ticketId);

    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        status: this.ticketStatus,
      },
    });

    const statusLabels = {
      2: "Open",
      3: "Pending",
      4: "Resolved",
      5: "Closed",
    };

    const statusLabel = statusLabels[this.ticketStatus] || this.ticketStatus;

    $.export(
      "$summary",
      `Ticket "${ticketName}" (ID: ${this.ticketId}) status updated to "${statusLabel}".`,
    );

    return response;
  },
};
