import drift from "../../drift.app.mjs";
import db from "../dev-db.mjs"; // For testing locally
import mockery$ from "../mockery-dollar.mjs"; // For local mock $ object

// TEST (FIX IN PRODUCTION) - your mockery input
const mockeryData = {
  limit: 50,
  db,
};

const testAction = {

  mockery: {
    drift,
    ...mockeryData,
  }, // TEST
  $emit: (a, meta) => console.log("EMIT:", a, meta), // Show emitted event and metadata
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
    const {
      db, drift, limit,
    } = this.mockery;

    const res = await drift.methods._makeRequest({
      $,
      path: `/conversations?limit=${limit}`,
    });

    const conversations = res?.data || [];

    if (!conversations.length) {
      console.log("No conversations found.");
      return;
    }

    const lastCreatedAt = await db.get("lastCreatedAt");

    if (!lastCreatedAt) {
      // First-time run — initialize DB with latest timestamp, skip emits
      const newest = Math.max(...conversations.map((c) => c.createdAt || 0));
      await db.set("lastCreatedAt", newest);
      console.log(`Initialized lastCreatedAt with ${newest}`);
      return;
    }

    // Emit conversations newer than lastCreatedAt
    for (const conversation of conversations) {
      const createdAt = conversation.createdAt || 0;
      if (createdAt > lastCreatedAt) {
        this.$emit(conversation, {
          id: conversation.id,
          summary: `New conversation with ID ${conversation.id}`,
          ts: createdAt,
        });
      }
    }

    // Update DB with newest timestamp
    const newest = conversations.reduce(
      (max, c) => Math.max(max, c.createdAt || 0),
      lastCreatedAt,
    );

    await db.set("lastCreatedAt", newest);
  },

};

// TEST (FIX IN PRODUCTION)
async function runTest() {
  await testAction.run(mockery$);
}
runTest();
