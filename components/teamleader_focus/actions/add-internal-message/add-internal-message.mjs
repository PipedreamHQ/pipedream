import teamleaderFocus from "../../teamleader_focus.app.mjs";

export default {
  key: "teamleader_focus-add-internal-message",
  name: "Add Internal Message to Ticket",
  description: "Adds an internal message to a ticket. [See the documentation](https://developer.focus.teamleader.eu/docs/api/tickets-add-internal-message)",
  version: "0.0.2",
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
      description: "Content of the internal message. Uses HTML formatting.",
    },
    ticketStatusId: {
      propDefinition: [
        teamleaderFocus,
        "ticketStatusId",
      ],
    },
    attachments: {
      propDefinition: [
        teamleaderFocus,
        "attachments",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      id: this.ticketId,
      body: this.body,
    };
    if (this.ticketStatusId) data.ticket_status_id = this.ticketStatusId;
    if (this.attachments) data.attachments = this.attachments;

    const response = await this.teamleaderFocus.addInternalMessage({
      $,
      data,
    });

    $.export("$summary", `Internal message added to ticket ${this.ticketId}`);
    return response;
  },
};
