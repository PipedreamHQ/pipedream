import common from "../board-based.mjs";

export default {
  ...common,
  key: "trello-new-label",
  name: "New Label (Instant)",
  description: "Emit new event for each new label added to a board.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "createLabel";
    },
    async getResult(event) {
      const labelId = event.body?.action?.data?.label?.id;
      return this.trello.getLabel(labelId);
    },
    generateMeta({
      id, name, color: summary,
    }) {
      summary += name
        ? ` - ${name}`
        : "";
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
  },
};
