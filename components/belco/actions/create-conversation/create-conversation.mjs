import belco from "../../belco.app.mjs";

export default {
  key: "belco-create-conversation",
  name: "Create Conversation",
  description: "Create a conversation from Belco. [See the documentation](https://developers.belco.io/reference/post_conversations)",
  version: "0.0.4",
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
    const response = await this.belco.createConversation({
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

    $.export("$summary", `New conversation created successfully with ID: ${response._id}`);
    return response;
  },
};
