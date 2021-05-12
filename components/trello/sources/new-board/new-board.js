const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-board",
  name: "New Board (Instant)",
  description: "Emits an event for each new board added.",
  version: "0.0.5",
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