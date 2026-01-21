import common from "../common/common-board-based.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-label",
  name: "New Label Created (Instant)",
  description: "Emit new event for each new label added to a board.",
  version: "0.1.4",
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
    isCorrectEventType({ type }) {
      return type === "createLabel";
    },
    getResult({ data }) {
      return this.app.getLabel({
        labelId: data?.label?.id,
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
  sampleEmit,
};
