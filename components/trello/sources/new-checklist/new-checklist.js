const common = require("../board-based.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-checklist",
  name: "New Checklist (Instant)",
  description: "Emits an event for each new checklist added to a board.",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "addChecklistToCard";
    },
    async getResult(event) {
      const checklistId = get(event, "body.action.data.checklist.id");
      return await this.trello.getChecklist(checklistId);
    },
  },
};