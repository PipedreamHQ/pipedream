import common from "../board-based.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-label",
  name: "New Label (Instant)",
  description: "Emit new event for each new label added to a board.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "createLabel";
    },
    async getResult(event) {
      const labelId = get(event, "body.action.data.label.id");
      return await this.trello.getLabel(labelId);
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
