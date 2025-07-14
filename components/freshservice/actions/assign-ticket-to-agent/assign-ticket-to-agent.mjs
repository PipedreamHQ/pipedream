import freshservice from "../../freshservice.app.mjs";

export default {
  key: "freshservice-assign-ticket-to-agent",
  name: "Assign Ticket to Agent",
  description: "Assign a ticket to an agent in Freshservice. [See the documentation](https://api.freshservice.com/v2/#update_ticket)",
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
    responder_id: {
      propDefinition: [
        freshservice,
        "agentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshservice.updateTicket({
      ticketId: this.ticketId,
      data: {
        responder_id: this.responder_id,
      },
      $,
    });

    const ticketName = await this.freshservice.getTicketName(this.ticketId);
    $.export("$summary", `Successfully assigned ticket "${ticketName}" to agent`);
    return response;
  },
};