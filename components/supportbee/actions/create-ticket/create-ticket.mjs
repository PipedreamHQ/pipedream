import supportbee from "../../supportbee.app.mjs";

export default {
  name: "Create Ticket",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "supportbee-create-ticket",
  description: "Creates a client. [See docs here](https://supportbee.com/api#create_ticket)",
  type: "action",
  props: {
    supportbee,
    subject: {
      label: "Subject",
      description: "The subject of the ticket",
      type: "string",
    },
    requesterName: {
      label: "Requester Name",
      description: "The requester name of the ticket",
      type: "string",
    },
    requesterEmail: {
      label: "Requester Email",
      description: "The requester email of the ticket",
      type: "string",
    },
    contentText: {
      label: "Content Text",
      description: "The text context of the ticket",
      type: "string",
      optional: true,
    },
    contentHtml: {
      label: "Content HTML",
      description: "The HTML context of the ticket",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.supportbee.createTicket({
      $,
      data: {
        ticket: {
          subject: this.subject,
          requester_name: this.requesterName,
          requester_email: this.requesterEmail,
          content: {
            text: this.contentText,
            html: this.contentHtml,
          },
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created ticket with id ${response.ticket.id}`);
    }

    return response;
  },
};
