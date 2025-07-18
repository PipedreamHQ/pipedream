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
    group_id: {
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
        group_id: this.group_id,
      },
      $,
    });

    const ticketName = await this.freshservice.getTicketName(this.ticketId);
    $.export("$summary", `Successfully assigned ticket "${ticketName}" to group`);
    return response;
  },
};