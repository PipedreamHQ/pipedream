import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-add-reply",
  name: "Add Reply to Ticket",
  description: "Adds a public reply to a ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-add-reply)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    teamleaderFocus,
    ticketId: {
      propDefinition: [
        teamleaderFocus,
        "ticketId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the reply. Uses HTML formatting.",
    },
    ticketStatusId: {
      type: "string",
      label: "Ticket Status ID",
      description: "Optionally update the ticket status when adding the reply.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description: "File IDs to attach. All files must have the ticket as subject.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      id: this.ticketId,
      body: this.body,
    };
    if (this.ticketStatusId) data.ticket_status_id = this.ticketStatusId;
    if (this.attachments) data.attachments = this.attachments;

    const response = await this.teamleaderFocus.addReply({
      $,
      data,
    });

    $.export("$summary", `Reply added to ticket ${this.ticketId}`);
    return response;
  },
};
