import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-card",
  name: "New Card (Instant)",
  description: "Emit new event for each new Trello card on a board.",
  version: "0.1.4",
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
      description: "If specified, events will only be emitted when a card is created in one of the specified lists",
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
    isCorrectEventType({ type }) {
      return type === "createCard";
    },
    getResult({ data }) {
      return this.app.getCard({
        cardId: data?.card?.id,
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
  sampleEmit,
};
