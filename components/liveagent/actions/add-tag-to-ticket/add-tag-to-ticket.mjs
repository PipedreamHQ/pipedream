import liveagent from "../../liveagent.app.mjs";

export default {
  key: "liveagent-add-tag-to-ticket",
  name: "Add Tag to Ticket",
  description: "Add a tag to a ticket. [See the documentation](https://support.liveagent.com/911737-API-v3)",
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
    tagId: {
      propDefinition: [
        liveagent,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const ticket = await this.liveagent.getTicket({
      $,
      ticketId: this.ticketId,
    });

    ticket.tags = ticket.tags || [];
    if (!ticket.tags.includes(this.tagId)) {
      ticket.tags = [
        ...ticket.tags,
        this.tagId,
      ];
    }

    const response = await this.liveagent.updateTicket({
      $,
      ticketId: this.ticketId,
      data: {
        ...ticket,
      },
    });
    $.export("$summary", `Successfully added tag to ticket with ID: ${this.ticketId}`);
    return response;
  },
};
