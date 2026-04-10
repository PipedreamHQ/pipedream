import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-get-ticket",
  name: "Get Ticket",
  description: "Get a ticket. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    liveagent,
    ticketId: {
      propDefinition: [
        liveagent,
        "ticketId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.liveagent.getTicket({
      $,
      ticketId: this.ticketId,
    });
    $.export("$summary", `Successfully retrieved ticket with ID: ${this.ticketId}`);
    return response;
  },
};
