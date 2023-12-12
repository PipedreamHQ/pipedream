import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emit new event for each new board added.",
  version: "0.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const boards = await this.trello.getBoards();
      return {
        sampleEvents: boards,
        sortField: "dateLastView",
      };
    },
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
