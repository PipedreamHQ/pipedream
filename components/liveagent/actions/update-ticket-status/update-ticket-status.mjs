import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-update-ticket-status",
  name: "Update Ticket Status",
  description: "Update the status of a ticket. [See the documentation](https://support.liveagent.com/911737-API-v3)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    liveagent,
    ticketId: {
      propDefinition: [
        liveagent,
        "ticketId",
        () => ({
          excludeClosedAndDeleted: true,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket",
      options: [
        {
          value: "I",
          label: "init",
        },
        {
          value: "N",
          label: "new",
        },
        {
          value: "T",
          label: "chatting",
        },
        {
          value: "P",
          label: "calling",
        },
        {
          value: "R",
          label: "resolved",
        },
        {
          value: "X",
          label: "deleted",
        },
        {
          value: "B",
          label: "spam",
        },
        {
          value: "A",
          label: "answered",
        },
        {
          value: "C",
          label: "open",
        },
        {
          value: "W",
          label: "postponed",
        },
      ],
    },
  },
  async run({ $ }) {
    const ticket = await this.liveagent.getTicket({
      $,
      ticketId: this.ticketId,
    });

    ticket.status = this.status;

    const response = await this.liveagent.updateTicket({
      $,
      ticketId: this.ticketId,
      data: {
        ...ticket,
      },
    });
    $.export("$summary", `Successfully updated ticket status to ${this.status}`);
    return response;
  },
};
