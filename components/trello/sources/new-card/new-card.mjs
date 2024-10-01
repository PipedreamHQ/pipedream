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
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const params = {
        customFieldItems: true,
      };
      const cards = this.lists?.length
        ? await this.app.getCardsInList({
          listId: this.lists[0],
          params,
        })
        : await this.app.getCards({
          boardId: this.board,
          params,
        });
      return cards;
    },
    getSortField() {
      return "dateLastActivity";
    },
    isCorrectEventType(event) {
      return event.body?.action?.type === "createCard";
    },
    getResult(event) {
      return this.app.getCard({
        cardId: event.body?.action?.data?.card?.id,
        params: {
          customFieldItems: true,
        },
      });
    },
    isRelevant({ result: card }) {
      if (this.board && this.board !== card.idBoard) return false;
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists?.length ||
          this.lists.includes(card.idList))
      );
    },
  },
};
