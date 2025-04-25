import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-set-ticket-status",
  name: "Set Ticket Status",
  description: "Update the status of a ticket in Freshdesk",
  version: "0.0.3",
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
    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        status: this.ticketStatus,
      },
    });
    $.export("$summary", `Ticket ${this.ticketId} status updated to ${this.ticketStatus}`);
    return response;
  },
};
