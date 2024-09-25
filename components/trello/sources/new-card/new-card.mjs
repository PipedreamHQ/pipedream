import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-card",
  name: "New Card (Instant)",
  description: "Emit new event for each new Trello card on a board.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    lists: {
      propDefinition: [
        common.props.app,
        "lists",
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
      const cards = this.lists && this.lists.length > 0
        ? await this.app.getCardsInList({
          listId: this.lists[0],
          params: {
            customFieldItems: this.customFieldItems,
          },
        })
        : await this.app.getCards({
          boardId: this.board,
          params: {
            customFieldItems: this.customFieldItems,
          },
        });
      return {
        sampleEvents: cards,
        sortField: "dateLastActivity",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "createCard";
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
