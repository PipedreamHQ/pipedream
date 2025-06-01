import drift from "../../drift.app.mjs";
import db from "../dev-db.mjs"; // local DB mock
import mockery$ from "../mockery-dollar.mjs"; // mock $

const mockeryData = {
  db,
  conversationId: 123456, // required
  messageContext: "user", // required: user, agent, bot, system
};

const testAction = {
  mockery: {
    drift,
    ...mockeryData,
  },
  key: "drift-new-message",
  name: "New Message in Conversation",
  description: "Emits a new event when a message is received in a specific Drift conversation.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",

  props: {
    drift,
    db: "$.service.db",
    conversationId: {
      type: "integer",
      label: "Conversation ID",
    },
    messageContext: {
      type: "string",
      label: "Message Context",
      options: ["user", "agent", "bot", "system"],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
      },
    },
  },

  async run({ $ }) {
    const {
      drift,
      db,
      conversationId,
      messageContext,
    } = this.mockery;

    const result = await drift.methods._makeRequest({
      $,
      path: `/conversations/${conversationId}`,
    });

    const messages = result?.data?.messages || [];
    const lastSeen = await db.get("lastMessageTs") || 0;

    const newMessages = messages
      .filter(m =>
        m.createdAt > lastSeen &&
        m.author?.type === messageContext
      )
      .sort((a, b) => a.createdAt - b.createdAt);

    for (const msg of newMessages) {
      this.$emit(msg, {
        id: msg.id,
        summary: `New ${msg.author?.type} message`,
        ts: msg.createdAt,
      });
    }

    if (newMessages.length) {
      await db.set("lastMessageTs", newMessages[newMessages.length - 1].createdAt);
    }
  },
};

async function runTest() {
  await testAction.run(mockery$);
}

runTest();
