import common from "../board-based.mjs";

export default {
  ...common,
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emit new event for each new list added to a board.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "createList";
    },
    async getResult(event) {
      const listId = event.body?.action?.data?.list?.id;
      return await this.trello.getList(listId);
    },
  },
};
