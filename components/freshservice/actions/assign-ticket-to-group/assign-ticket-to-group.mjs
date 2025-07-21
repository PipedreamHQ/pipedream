import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-assign-ticket-to-group",
  name: "Assign Ticket to Group",
  description: "Assign a ticket to a group in Freshservice. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    ticketId: {
      propDefinition: [
        freshservice,
        "ticketId",
      ],
    },
    groupId: {
      propDefinition: [
        freshservice,
        "groupId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshservice.updateTicket({
      ticketId: this.ticketId,
      data: {
        group_id: this.groupId,
      },
      $,
    });

    try {
      const ticketName = await this.freshservice.getTicketName(this.ticketId);
      $.export("$summary", `Successfully assigned ticket "${ticketName}" to group`);
    } catch (error) {
      $.export("$summary", `Successfully assigned ticket ${this.ticketId} to group`);
    }
    return response;
  },
};