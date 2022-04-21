import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-updates",
  name: "Card Updates (Instant)",
  description: "Emit new event for each update to a Trello card.",
  version: "0.0.7",
  type: "source",
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
      const eventType = event.body?.action?.type;
      return eventType === "updateCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
  },
};
