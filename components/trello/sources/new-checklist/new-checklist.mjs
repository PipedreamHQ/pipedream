import common from "../board-based.mjs";

export default {
  ...common,
  key: "trello-new-checklist",
  name: "New Checklist (Instant)",
  description: "Emit new event for each new checklist added to a board.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "addChecklistToCard";
    },
    async getResult(event) {
      const checklistId = event.body?.action?.data?.checklist?.id;
      return this.trello.getChecklist(checklistId);
    },
  },
};
