import common from "../common/common-board-based.mjs";

export default {
  ...common,
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emit new event for each new list added to a board.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const lists = await this.app.getLists({
        boardId: this.board,
      });
      return {
        sampleEvents: lists,
        sortField: "id",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "createList";
    },
    async getResult(event) {
      const listId = event.body?.action?.data?.list?.id;
      return await this.app.getList({
        listId,
      });
    },
  },
};
