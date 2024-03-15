import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-updates",
  name: "Card Updates (Instant)",
  description: "Emit new event for each update to a Trello card.",
  version: "0.0.12",
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
    customFieldItems: {
      propDefinition: [
        common.props.trello,
        "customFieldItems",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      let cards = [];
      if (this.cards && this.cards.length > 0) {
        for (const cardId of this.cards) {
          const card = await this.trello.getCard(cardId, {
            customFieldItems: this.customFieldItems,
          });
          cards.push(card);
        }
      } else {
        cards = await this.trello.getCards(this.board, {
          customFieldItems: this.customFieldItems,
        });
      }
      return {
        sampleEvents: cards,
        sortField: "dateLastActivity",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "updateCard";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.trello.getCard(cardId, {
        customFieldItems: this.customFieldItems,
      });
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
  },
};
