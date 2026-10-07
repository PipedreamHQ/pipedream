import belco from "../../belco.app.mjs";
import { buildRecipient } from "../../common/utils.mjs";

export default {
  key: "belco-create-conversation",
  name: "Create Conversation",
  description: "Create a conversation from Belco. [See the documentation](https://developers.belco.io/reference/post_conversations)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
        ({ shopId }) => ({
          shopId,
        }),
      ],
      description: "The Belco contact ID of the recipient. Use **List Contacts** (filter by `Email`) to find it, or set `To Email` instead to skip the lookup. Required unless `To Email` is set or `Type` is `inbound-message` or `note`.",
      optional: true,
    },
    toType: {
      propDefinition: [
        belco,
        "toType",
      ],
    },
    toEmail: {
      propDefinition: [
        belco,
        "toEmail",
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
        to: buildRecipient({
          to: this.to,
          toType: this.toType,
          toEmail: this.toEmail,
          channel: this.channel,
          type: this.type,
        }),
        subject: this.subject,
        body: this.body,
      },
    });

    $.export("$summary", `New conversation created successfully with ID: ${response._id}`);
    return response;
  },
};
