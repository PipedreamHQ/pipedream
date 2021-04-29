const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-checklist",
  name: "New Checklist (Instant)",
  description: "Emits an event for each new checklist added to a board.",
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
      if (eventType !== "addChecklistToCard") return false;
      return true;
    },
    async getResult(event) {
      const checklistId = get(event, "body.action.data.checklist.id");
      return await this.trello.getChecklist(checklistId);
    },
    isRelevant({ result: checklist }) {
      if (this.board && this.board !== checklist.idBoard) return false;
      return true;
    },
    generateMeta(checklist) {
      return this.generateCommonMeta(checklist);
    },
  },
};