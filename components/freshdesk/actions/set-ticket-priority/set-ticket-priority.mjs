import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-set-ticket-priority",
  name: "Set Ticket Priority",
  description: "Update the priority of a ticket in Freshdesk",
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
    ticketPriority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        priority: this.ticketPriority,
      },
    });
    $.export("$summary", `Ticket ${this.ticketId} priority updated to ${this.ticketPriority}`);
    return response;
  },
};
