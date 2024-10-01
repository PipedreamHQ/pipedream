import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emit new event for each new board added.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const boards = await this.app.getBoards();
      const allBoards = [];
      for (const board of boards) {
        const b = await this.app.getBoard({
          boardId: board.id,
        });
        allBoards.push(b);
      }
      return allBoards;
    },
    getSortField() {
      return "dateLastView";
    },
    isCorrectEventType(event) {
      return event.body?.action?.type === "createBoard";
    },
    getResult(event) {
      return this.app.getBoard({
        boardId: event.body?.action?.data?.board?.id,
      });
    },
  },
};
