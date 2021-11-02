import common from "../common-webhook.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emit new event for each new board added.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "createBoard";
    },
    async getResult(event) {
      const boardId = get(event, "body.action.data.board.id");
      return await this.trello.getBoard(boardId);
    },
  },
};
