import drift from "../../drift.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "drift-new-conversation",
  name: "New Conversation",
  description: "Emit new when a new conversation is started in Drift. [See the documentations](https://devdocs.drift.com/docs/retrieve-a-conversation)",
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
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },

  async run({ $ }) {
    const {
      db, drift,
    } = this;

    const conversations = [];

    const result = await drift._makeRequest({
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
      const next = await drift.getNextPage($, nextUrl);
      isEnough = next.data.some((obj) => obj.id === lastConversation);
      conversations.push(...next.data);
      nextUrl = next.links?.next;
    };

    conversations.sort((a, b) => a.id - b.id);

    const lastConvIndex = conversations.findIndex((obj) => obj.id === lastConversation);

    if (lastConvIndex === -1) {
      throw new Error ("lastConversation not found in fetched data. Skipping emit.");
    };

    if (lastConvIndex + 1 === conversations.length) {
      console.log("No new conversations found");
      return;
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
