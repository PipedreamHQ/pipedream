import belco from "../../belco.app.mjs";

export default {
  key: "belco-send-message",
  name: "Send Message",
  description: "Send a message to a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/post_conversations-sendmessage)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    belco,
    shopId: {
      propDefinition: [
        belco,
        "shopId",
      ],
    },
    channel: {
      propDefinition: [
        belco,
        "channel",
      ],
    },
    type: {
      propDefinition: [
        belco,
        "type",
      ],
    },
    fromType: {
      propDefinition: [
        belco,
        "fromType",
      ],
    },
    from: {
      propDefinition: [
        belco,
        "from",
        ({
          fromType, shopId,
        }) => ({
          fromType,
          shopId,
        }),
      ],
    },
    to: {
      propDefinition: [
        belco,
        "to",
        ({
          toType, shopId,
        }) => ({
          toType,
          shopId,
        }),
      ],
    },
    subject: {
      propDefinition: [
        belco,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        belco,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.belco.sendMessage({
      $,
      data: {
        shopId: this.shopId,
        channel: this.channel,
        type: this.type,
        from: {
          type: this.fromType,
          _id: this.from,
        },
        to: {
          type: "contact",
          _id: this.to,
        },
        subject: this.subject,
        body: this.body,
      },
    });

    $.export("$summary", `Sent message successfully: ${this.subject || "No subject"}`);
    return response;
  },
};
