import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    _getComment() {
      return this.db.get("comment");
    },
    _setComment(comment) {
      this.db.set("comment", comment);
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "commentCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      const comment = event.body?.action?.data?.text;
      /** Record comment to use in generateMeta() */
      this._setComment(comment);
      return this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
    generateMeta({ id }) {
      const comment = this._getComment();
      return {
        id,
        summary: comment,
        ts: Date.now(),
      };
    },
  },
};
