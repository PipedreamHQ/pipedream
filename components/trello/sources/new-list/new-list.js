const common = require("../board-based.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emits an event for each new list added to a board.",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "createList";
    },
    async getResult(event) {
      const listId = get(event, "body.action.data.list.id");
      return await this.trello.getList(listId);
    },
  },
};