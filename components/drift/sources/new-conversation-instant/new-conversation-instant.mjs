import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-conversation-instant",
  name: "New Conversation",
  description: "Emits an event every time a new conversation is started in Drift.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    drift,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "How often to poll Drift for new conversations.",
    },
    limit: {
      type: "integer",
      label: "Maximum Conversations to Fetch",
      description: "The number of most recent conversations to retrieve each time the source runs.",
      default: 50,
      optional: true,
      min: 1,
      max: 500,
    },
  },

  async run({ $ }) {
    const lastTimestamp = this.db.get("lastCreatedAt") || 0;

    const res = await this.drift._makeRequest({
      $,
      path: `/conversations?limit=${this.limit}&sort=createdAt`,
    });

    const conversations = res?.data || [];

    for (const conversation of conversations) {
      const createdAt = conversation.createdAt || 0;

      if (createdAt > lastTimestamp) {
        this.$emit(conversation, {
          id: conversation.id,
          summary: `New conversation with ID ${conversation.id}`,
          ts: createdAt,
        });
      }
    }

    const newest = conversations.reduce((max, c) =>
      Math.max(max, c.createdAt || 0), lastTimestamp);

    this.db.set("lastCreatedAt", newest);
  },
};
