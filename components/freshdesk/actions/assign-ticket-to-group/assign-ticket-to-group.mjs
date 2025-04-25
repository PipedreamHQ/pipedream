import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-assign-ticket-to-group",
  name: "Assign Ticket to Group",
  description: "Assign a Freshdesk ticket to a specific group",
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
    group_id: {
      type: "integer",
      label: "Group ID",
      description: "ID of the group to assign this ticket to",
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        group_id: this.group_id,
      },
    });
    $.export("$summary", `Ticket ${this.ticketId} assigned to group ${this.group_id}`);
    return response;
  },
};
