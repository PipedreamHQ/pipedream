const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-member-on-card",
  name: "New Member on Card (Instant)",
  description:
    "Emits an event for each card joined by the authenticated Trello user.",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      if (eventType !== "addMemberToCard") return false;
      return true;
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      if (this.boardId && this.boardId !== card.idBoard) return false;
      return true;
    },
    generateMeta(card) {
      return this.generateCommonMeta(card);
    },
  },
};