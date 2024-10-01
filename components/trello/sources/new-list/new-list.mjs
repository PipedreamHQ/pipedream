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
    getSampleEvents() {
      return this.app.getLists({
        boardId: this.board,
      });
    },
    getSortField() {
      return "id";
    },
    isCorrectEventType(event) {
      return event.body?.action?.type === "createList";
    },
    getResult(event) {
      return this.app.getList({
        listId: event.body?.action?.data?.list?.id,
      });
    },
  },
};
