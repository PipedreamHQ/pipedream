const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-activity",
  name: "New Activity (Instant)",
  description: "Emits an event for new activity on a board.",
  version: "0.0.1",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
  },
  methods: {
    ...common.methods,
    async getResult(event) {
      return event.body;
    },
    isRelevant({ event }) {
      const boardId = get(event, "body.action.data.board.id");
      return !this.board || this.board === boardId;
    },
    generateMeta({ action }) {
      const { id, type: summary, date } = action;
      return {
        id,
        summary,
        ts: Date.parse(date),
      };
    },
  },
};