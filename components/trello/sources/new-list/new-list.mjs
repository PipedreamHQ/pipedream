import common from "../board-based.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emit new event for each new list added to a board.",
  version: "0.0.5",
  type: "source",
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
