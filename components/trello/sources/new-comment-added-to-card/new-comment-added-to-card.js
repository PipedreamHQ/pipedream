const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emits an event for each new comment added to a card.",
  version: "0.0.4",
  dedupe: "unique",
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
      if (eventType !== "commentCard") return false;
      return true;
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card, event }) {
      const comment = get(event, "body.action.data.text");
      /** Record comment to use in generateMeta() */
      this.db.set("comment", comment);

      if (this.board && this.board !== card.idBoard) return false;
      if (this.cards && this.cards.length > 0 && !this.cards.includes(card.id))
        return false;
      return true;
    },
    generateMeta({ id }) {
      const comment = this.db.get("comment");
      return {
        id,
        summary: comment,
        ts: Date.now(),
      };
    },
  },
};