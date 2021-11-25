import common from "../common-webhook.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.0.5",
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
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "commentCard";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      const comment = get(event, "body.action.data.text");
      /** Record comment to use in generateMeta() */
      this.db.set("comment", comment);
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
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
