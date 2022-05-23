import gorgias from "../../gorgias.app.mjs";

export default {
  key: "gorgias-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the docs](https://developers.gorgias.com/reference/post_api-tickets)",
  version: "0.0.2",
  type: "action",
  props: {
    gorgias,
    fromAddress: {
      propDefinition: [
        gorgias,
        "address",
      ],
      label: "From Address",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the message",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message of the ticket. Accepts HTML",
    },
    channel: {
      propDefinition: [
        gorgias,
        "channel",
      ],
    },
    via: {
      propDefinition: [
        gorgias,
        "via",
      ],
    },
    toAddress: {
      propDefinition: [
        gorgias,
        "address",
      ],
      label: "To Address",
    },
  },
  async run({ $ }) {
    const data = {
      messages: [
        {
          from_agent: false,
          subject: this.subject,
          body_html: this.message,
          channel: this.channel,
          via: this.via,
          source: {
            from: {
              address: this.fromAddress,
            },
            to: [
              {
                address: this.toAddress,
              },
            ],
          },
        },
      ],
    };

    const response = await this.gorgias.createTicket({
      $,
      data,
    });
    $.export("$summary", `Succesfully created ticket ${response.id}`);
    return response;
  },
};
