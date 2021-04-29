const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-label",
  name: "New Label (Instant)",
  description: "Emits an event for each new label added to a board.",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      if (eventType !== "createLabel") return false;
      return true;
    },
    async getResult(event) {
      const labelId = get(event, "body.action.data.label.id");
      return await this.trello.getLabel(labelId);
    },
    isRelevant({ result: label }) {
      if (this.board && this.board !== label.idBoard) return false;
      return true;
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