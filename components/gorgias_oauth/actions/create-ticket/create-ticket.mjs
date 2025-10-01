import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-create-ticket",
  name: "Create Ticket",
  description: "Create a new ticket. [See the docs](https://developers.gorgias.com/reference/post_api-tickets)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gorgias_oauth,
    fromAddress: {
      propDefinition: [
        gorgias_oauth,
        "address",
      ],
      label: "From Address",
    },
    subject: {
      propDefinition: [
        gorgias_oauth,
        "subject",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message of the ticket. Accepts HTML",
    },
    channel: {
      propDefinition: [
        gorgias_oauth,
        "channel",
      ],
    },
    via: {
      propDefinition: [
        gorgias_oauth,
        "via",
      ],
    },
    toAddress: {
      propDefinition: [
        gorgias_oauth,
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

    const response = await this.gorgias_oauth.createTicket({
      $,
      data,
    });
    $.export("$summary", `Succesfully created ticket ${response.id}`);
    return response;
  },
};
