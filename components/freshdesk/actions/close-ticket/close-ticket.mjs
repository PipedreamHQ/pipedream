import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-close-ticket",
  name: "Close Ticket",
  description: "Set a Freshdesk ticket's status to 'Closed'. [See docs](https://developers.freshdesk.com/api/#update_a_ticket)",
  version: "0.0.7",
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
    const CLOSED_STATUS = 5; // Freshdesk status code for 'Closed'

    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        status: CLOSED_STATUS,
      },
    });

    $.export("$summary", `Ticket ${this.ticketId} closed successfully`);
    return response;
  },
};
