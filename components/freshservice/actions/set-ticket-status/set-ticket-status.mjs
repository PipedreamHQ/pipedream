import freshservice from "../../freshservice.app.mjs";
import { TICKET_STATUS } from "../../common/constants.mjs";

export default {
  key: "freshservice-set-ticket-status",
  name: "Set Ticket Status",
  description: "Set the status of a ticket in Freshservice. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
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
    status: {
      propDefinition: [
        freshservice,
        "ticketStatus",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshservice.updateTicket({
      ticketId: this.ticketId,
      data: {
        status: this.status,
      },
      $,
    });

    const ticketName = await this.freshservice.getTicketName(this.ticketId);
    const statusLabel = TICKET_STATUS[this.status];
    $.export("$summary", `Successfully set status of ticket "${ticketName}" to ${statusLabel}`);
    return response;
  },
};