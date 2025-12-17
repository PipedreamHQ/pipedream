import infobip from "../../infobip.app.mjs";

export default {
  key: "infobip-send-viber-text-message",
  name: "Send Viber Text Message",
  description: "Send a text message to multiple recipients via Viber. [See the documentation](https://www.infobip.com/docs/api/channels/viber/viber-business-messages/send-viber-messages)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infobip,
    from: {
      propDefinition: [
        infobip,
        "from",
      ],
    },
    to: {
      propDefinition: [
        infobip,
        "to",
      ],
    },
    contentText: {
      type: "string",
      label: "Content Text",
      description: "The text content to send in bulk messages.",
    },
  },
  async run({ $ }) {
    const response = await this.infobip.sendViberMessage({
      $,
      data: {
        messages: [
          {
            sender: this.from,
            destinations: [
              {
                to: this.to,
              },
            ],
            content: {
              type: "TEXT",
              text: this.contentText,
            },
          },
        ],
      },
    });

    $.export("$summary", response.messages[0].status.description);
    return response;
  },
};
