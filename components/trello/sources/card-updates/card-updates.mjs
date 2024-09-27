import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-updates",
  name: "Card Updates (Instant)",
  description: "Emit new event for each update to a Trello card.",
  version: "0.1.0",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    cards: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
    customFieldItems: {
      propDefinition: [
        common.props.app,
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
          const card = await this.app.getCard({
            cardId,
            params: {
              customFieldItems: this.customFieldItems,
            },
          });
          cards.push(card);
        }
      } else {
        cards = await this.app.getCards({
          boardId: this.board,
          params: {
            customFieldItems: this.customFieldItems,
          },
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
      return this.app.getCard({
        cardId,
        params: {
          customFieldItems: this.customFieldItems,
        },
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
