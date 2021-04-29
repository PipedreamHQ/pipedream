const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-card-updates",
  name: "Card Updates (Instant)",
  description: "Emits an event for each update to a Trello card.",
  version: "0.0.4",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({ board: c.board }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      if (eventType !== "updateCard") return false;
      return true;
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      if (this.board && this.board !== card.idBoard) return false;
      if (this.cards && this.cards.length > 0 && !this.cards.includes(card.id))
        return false;
      return true;
    },
    generateMeta(card) {
      return this.generateCommonMeta(card);
    },
  },
};