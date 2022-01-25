import common from "../board-based.mjs";
import get from "loadsh/get.js";

export default {
  ...common,
  key: "trello-new-checklist",
  name: "New Checklist (Instant)",
  description: "Emit new event for each new checklist added to a board.",
  version: "0.0.6",
  type: "source",
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
