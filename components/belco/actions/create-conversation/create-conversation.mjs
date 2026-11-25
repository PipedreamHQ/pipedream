import belco from "../../belco.app.mjs";
import { buildRecipient } from "../../common/utils.mjs";

export default {
  key: "belco-create-conversation",
  name: "Create Conversation",
  description: "Start a new Belco conversation in a shop on the `email`, `chat` or `phone` channel, sending `Body` as its first message."
    + " Use this to open a fresh thread, such as an outbound message or follow-up to a customer, or to log an inbound message or internal note."
    + " To add a message to a conversation that already exists, use **Reply to Conversation** instead."
    + " Address the recipient with either `To` (a contact ID from **List Contacts**) or `To Email` (email channel only); `To Email` wins when both are set."
    + " Returns the created conversation; its `_id` can be passed to **Retrieve Conversation**, **Reply to Conversation** or **Close Conversation**."
    + " [See the documentation](https://developers.belco.io/reference/post_conversations)",
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
      description: "The Belco contact ID of the recipient, e.g. `YX6HM6Sfbt4GvbvZb`. Use **List Contacts** (filter by `Email`) to find it (the `_id` field), or set `To Email` instead to skip the lookup. Required unless `To Email` is set or `Type` is `inbound-message` or `note`.",
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
