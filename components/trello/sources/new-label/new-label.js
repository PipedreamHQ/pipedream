const common = require("../board-based.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-label",
  name: "New Label (Instant)",
  description: "Emits an event for each new label added to a board.",
  version: "0.0.4",
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
    generateMeta({ id, name, color: summary }) {
      summary += name ? ` - ${name}` : "";
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
  },
};