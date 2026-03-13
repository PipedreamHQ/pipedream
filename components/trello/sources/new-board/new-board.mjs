import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emit new event for each new board added.",
  version: "0.1.4",
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
    isCorrectEventType({ type }) {
      return type === "createBoard";
    },
    getResult({ data }) {
      return this.app.getBoard({
        boardId: data?.board?.id,
      });
    },
  },
  sampleEmit,
};
