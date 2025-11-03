import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-create-ticket",
  name: "Create Ticket",
  description: "Creates a new ticket in Helpspace. [See the documentation](https://documentation.helpspace.com/api-tickets)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpspace,
    channelId: {
      type: "integer",
      label: "Channel ID",
      description: "The ID of the channel",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Name of the ticket",
    },
    fromContact: {
      propDefinition: [
        helpspace,
        "customerEmail",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message text of the ticket",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the ticket",
      optional: true,
      options: [
        "unassigned",
        "open",
        "escalated",
        "spam",
        "waiting",
        "closed",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.helpspace.createTicket({
      $,
      data: {
        channel: {
          id: this.channelId,
        },
        subject: this.subject,
        from_contact: {
          email: this.fromContact,
        },
        status: this.status,
        message: {
          body: this.message,
        },
      },
    });
    $.export("$summary", `Successfully created ticket with ID: ${data.id}`);
    return data;
  },
};
