import freshservice from "../../freshservice.app.mjs";
import { TICKET_PRIORITY } from "../../common/constants.mjs";

export default {
  key: "freshservice-set-ticket-priority",
  name: "Set Ticket Priority",
  description: "Set the priority of a ticket in Freshservice. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
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
    priority: {
      propDefinition: [
        freshservice,
        "ticketPriority",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshservice.updateTicket({
      ticketId: this.ticketId,
      data: {
        priority: this.priority,
      },
      $,
    });

    try {
      const ticketName = await this.freshservice.getTicketName(this.ticketId);
      const priorityLabel = TICKET_PRIORITY[this.priority];
      $.export("$summary", `Successfully set priority of ticket "${ticketName}" to ${priorityLabel}`);
    } catch (error) {
      const priorityLabel = TICKET_PRIORITY[this.priority];
      $.export("$summary", `Successfully set priority of ticket ${this.ticketId} to ${priorityLabel}`);
    }
    return response;
  },
};