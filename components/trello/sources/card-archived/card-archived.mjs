import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-archived",
  name: "Card Archived (Instant)",
  description: "Emit new event for each card archived.",
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
    lists: {
      optional: true,
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
    getFilteredCards({
      boardId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/boards/${boardId}/cards`,
        ...args,
      });
    },
    async getSampleEvents() {
      const cards = await this.getFilteredCards({
        boardId: this.board,
        params: {
          filter: "closed",
        },
      });
      return {
        sampleEvents: cards,
        sortField: "dateLastActivity",
      };
    },
    isCorrectEventType(event) {
      const eventTranslationKey = event.body?.action?.display?.translationKey;
      return eventTranslationKey === "action_archived_card";
    },
    async getResult(event) {
      const cardId = event.body?.action?.data?.card?.id;
      return this.app.getCard({
        cardId,
      });
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(card.idList))
      );
    },
  },
};
