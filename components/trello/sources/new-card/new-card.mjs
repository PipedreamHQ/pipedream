import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-card",
  name: "New Card (Instant)",
  description: "Emit new event for each new Trello card on a board.",
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
    lists: {
      propDefinition: [
        common.props.trello,
        "lists",
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
      return eventType === "createCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      if (this.board && this.board !== card.idBoard) return false;
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(card.idList))
      );
    },
  },
};
