import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-assign-ticket-to-group",
  name: "Assign Ticket to Group",
  description: "Assign a Freshdesk ticket to a specific group [See the documentation](https://developers.freshdesk.com/api/#update_ticket).",
  version: "0.0.6",
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
    group_id: {
      propDefinition: [
        freshdesk,
        "groupId",
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
        group_id: this.group_id,
      },
    });

    $.export("$summary",
      `Ticket "${ticketName}" (ID: ${this.ticketId}) assigned to group ${this.group_id}`);

    return response;
  },
};
