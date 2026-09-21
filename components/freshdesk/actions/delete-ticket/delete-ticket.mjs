import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-delete-ticket",
  name: "Delete Ticket",
  description: "Delete a ticket in Freshdesk. This is a soft delete, so the ticket can be restored later. [See the documentation](https://developers.freshdesk.com/api/#delete_a_ticket)",
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
  },
  async run({ $ }) {
    await this.freshdesk.deleteTicket({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully deleted ticket ${this.ticketId}`);
    return {
      success: true,
    };
  },
};
