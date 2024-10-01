import common from "../common/common-board-based.mjs";

export default {
  ...common,
  key: "trello-new-label",
  name: "New Label Created (Instant)",
  description: "Emit new event for each new label added to a board.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleEvents() {
      return this.app.findLabel({
        boardId: this.board,
      });
    },
    getSortField() {
      return "id";
    },
    isCorrectEventType(event) {
      return event.body?.action?.type === "createLabel";
    },
    getResult(event) {
      return this.app.getLabel({
        labelId: event.body?.action?.data?.label?.id,
      });
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
