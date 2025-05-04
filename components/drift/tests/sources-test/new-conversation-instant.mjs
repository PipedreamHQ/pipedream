import drift from "../../drift.app.mjs";
import db from "../dev-db.mjs"; // For testing locally
import mockery$ from "../mockery-dollar.mjs"; // For local mock $ object

// TEST (FIX IN PRODUCTION) - your mockery input
const mockeryData = {
  limit: 2,
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
  },
  hooks: {
    async activate() {

      const {
        drift,
        db,
      } = this.mockery;

      await db.set("lastConversation", null); //reset

      const result = await drift.methods._makeRequest({
        $: drift.methods._mock$(),
        path: "/conversations/list?limit=100&statusId=1",
      });

      if (!result.data.length) {
        console.log("No conversations found.");
        return;
      };

      await db.set("lastConversation", result.data[0].id);
      console.log(`Initialized with ID ${result.data[0].id}.`);

      console.log("here");

    },
  },

  async run({ $ }) {
    const {
      db, drift,
    } = this.mockery;

    const conversations = [];

    const result = await drift.methods._makeRequest({
      $,
      path: "/conversations/list?limit=100&statusId=1",
    });

    if (!result.data.length) {
      console.log("No conversations found.");
      return;
    };

    const lastConversation = await db.get("lastConversation");

    if (!lastConversation) {
      await db.set("lastConversation", result.data[0].id);
      console.log(`Initialized with ID ${result.data[0].id}.`);
      return;
    };

    let isEnough = result.data.some((obj) => obj.id === lastConversation);

    conversations.push(...result.data);

    let nextUrl = result.links?.next;

    while (!isEnough && nextUrl) {
      const next = await drift.methods.getNextPage($, nextUrl);
      isEnough = next.data.some((obj) => obj.id === lastConversation);
      conversations.push(...next.data);
      nextUrl = next.links?.next;
    };

    conversations.sort((a, b) => a.id - b.id);

    const lastConvIndex = conversations.findIndex((obj) => obj.id === lastConversation);

    if (lastConvIndex === -1) {
      throw new Error ("lastConversation not found in fetched data. Skipping emit.");
    };

    for (let i = lastConvIndex + 1; i < conversations.length; i++) {

      this.$emit(conversations[i], {
        id: conversations[i].id,
        summary: `New conversation with ID ${conversations[i].contactId}`,
        ts: conversations[i].createdAt,
      });

    };

    const lastConvId = conversations[conversations.length - 1].id;
    await db.set("lastConversation", lastConvId);
  },
};

// TEST (FIX IN PRODUCTION)
async function runTest() {
  await testAction.hooks.activate.call(testAction);
  await testAction.run(mockery$);
}
runTest();
