const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emits an event for each new list added to a board.",
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
      if (eventType !== "createList") return false;
      return true;
    },
    async getResult(event) {
      const listId = get(event, "body.action.data.list.id");
      return await this.trello.getList(listId);
    },
    isRelevant({ result: list }) {
      if (this.board && this.board !== list.idBoard) return false;
      return true;
    },
    generateMeta(list) {
      return this.generateCommonMeta(list);
    },
  },
};