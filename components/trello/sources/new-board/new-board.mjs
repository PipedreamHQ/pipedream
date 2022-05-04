import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emit new event for each new board added.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "createBoard";
    },
    async getResult(event) {
      const boardId = event.body?.action?.data?.board?.id;
      return this.trello.getBoard(boardId);
    },
  },
};
