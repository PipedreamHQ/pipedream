import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-assign-ticket-to-agent",
  name: "Assign Ticket to Agent",
  description: "Assign a Freshdesk ticket to a specific agent. [See the documentation](https://developers.freshdesk.com/api/#update_ticket).",
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
    responder_id: {
      propDefinition: [
        freshdesk,
        "agentId",
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
        responder_id: this.responder_id,
      },
    });
    $.export("$summary",
      `Ticket "${ticketName}" (ID: ${this.ticketId}) assigned to agent ${this.responder_id}`);

    return response;
  },
};
