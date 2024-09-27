import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-card-archived",
  name: "Card Archived (Instant)", /* eslint-disable-line pipedream/source-name */
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
    async getSampleEvents() {
      const cards = await this.app.getFilteredCards({
        boardId: this.board,
        filter: "closed",
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
        (!this.lists?.length ||
          this.lists.includes(card.idList))
      );
    },
  },
};
