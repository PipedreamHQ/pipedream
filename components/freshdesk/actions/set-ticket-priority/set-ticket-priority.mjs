import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-set-ticket-priority",
  name: "Set Ticket Priority",
  description: "Update the priority of a ticket in Freshdesk  [See the documentation](https://developers.freshdesk.com/api/#update_ticket).",
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
    ticketPriority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
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
        priority: this.ticketPriority,
      },
    });

    const priorityLabels = {
      1: "Low",
      2: "Medium",
      3: "High",
      4: "Urgent",
    };

    const priorityLabel = priorityLabels[this.ticketPriority] || this.ticketPriority;

    $.export("$summary",
      `Ticket ${ticketName} (ID: ${this.ticketId}) priority updated to "${priorityLabel}".`);

    return response;
  },
};
