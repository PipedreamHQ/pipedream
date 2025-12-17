import app from "../../trengo.app.mjs";

export default {
  type: "action",
  version: "0.0.3",
  key: "trengo-send-a-ticket-message",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Send A Ticket Message",
  description: "Send a message to a ticket. [See the documentation](https://developers.trengo.com/reference/send-a-message)",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    internalNote: {
      type: "boolean",
      label: "Internal Note",
      description: "If true, this message will be visible only to your team",
      optional: true,
      default: false,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the message. Only used when the message is an email.",
      optional: true,
    },
    attachmentIds: {
      propDefinition: [
        app,
        "attachmentIds",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sendTicketMessage({
      $,
      ticketId: this.ticketId,
      data: {
        message: this.message,
        internal_note: this.internalNote,
        subject: this.subject,
        attachment_ids: this.attachmentIds,
      },
    });

    $.export("$summary", `Message sent to ticket ${this.ticketId}`);

    return resp;
  },
};
