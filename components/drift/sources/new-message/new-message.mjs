import drift from "../../drift.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { doesContextMatch } from "../../common/utils.mjs";

export default {
  key: "drift-new-message",
  name: "New Message in Conversation",
  description: "Emit new event when a message is received in a specific Drift conversation. [See the documentations](https://devdocs.drift.com/docs/retrieve-a-conversations-messages)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",

  props: {
    drift,
    db: "$.service.db",
    conversationId: {
      type: "integer",
      label: "Conversation ID",
      description: "Enter the ID of the conversation",
    },
    messageContext: {
      type: "object",
      label: "Message Context",
      description: "Enter message context [See the documentation](https://devdocs.drift.com/docs/message-model).",
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "How often to poll Drift for new messages.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },

  async run({ $ }) {
    const {
      drift,
      db,
      conversationId,
    } = this;

    const messageContext = drift.parseIfJSONString(this.messageContext);

    console.log(messageContext);
    const messages = await drift.getMessagesByConvId($, conversationId);

    if (!messages?.length) {
      console.log("No messages found.");
      return;
    };

    let lastMessageId = await db.get("lastMessage");

    const lastFetchedMsgId = messages[messages.length - 1].id;

    if (!lastMessageId) {
      await db.set("lastMessage", lastFetchedMsgId);
      console.log(`Initialized with ID ${lastFetchedMsgId}.`);
      return;
    };

    if (lastMessageId === lastFetchedMsgId) {
      console.log("No new messages found");
      return;
    };

    const lastMessageIndex = messages.findIndex((obj) => obj.id === lastMessageId);

    if (lastMessageIndex === -1) {
      console.log("Last message ID not found.");
      return;
    };

    for (let i = lastMessageIndex + 1; i < messages.length; i++) {
      if (messageContext) {
        if (!doesContextMatch(messageContext, messages[i].context)) continue;
      }
      this.$emit(messages[i], {
        id: messages[i].id,
        summary: `New message with ID ${messages[i].id}`,
        ts: messages[i].createdAt,
      });
    };

    await db.set("lastMessage", lastFetchedMsgId);

  },
};
