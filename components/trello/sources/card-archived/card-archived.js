const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-card-archived",
  name: "Card Archived (Instant)",
  description: "Emits an event for each card archived.",
  version: "0.0.5",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
    lists: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({ board: c.board }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventTranslationKey = get(
        event,
        "body.action.display.translationKey"
      );
      if (eventTranslationKey !== "action_archived_card") return false;
      return true;
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      if (this.board && this.board !== card.idBoard) return false;
      if (
        this.lists &&
        this.lists.length > 0 &&
        !this.lists.includes(card.idList)
      )
        return false;
      return true;
    },
    generateMeta(card) {
      return this.generateCommonMeta(card);
    },
  },
};