import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-assign-ticket-to-agent",
  name: "Assign Ticket to Agent",
  description: "Assign a Freshdesk ticket to a specific agent",
  version: "0.0.1",
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
      type: "integer",
      label: "Agent ID",
      description: "ID of the agent to assign this ticket to",
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk._makeRequest({
      $,
      method: "PUT",
      url: `/tickets/${this.ticketId}`,
      data: {
        responder_id: this.responder_id,
      },
    });
    $.export("$summary", `Ticket ${this.ticketId} assigned to agent ${this.responder_id}`);
    return response;
  },
};