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
    getSampleEvents() {
      return this.app.getFilteredCards({
        boardId: this.board,
        filter: "closed",
      });
    },
    getSortField() {
      return "dateLastActivity";
    },
    isCorrectEventType(event) {
      return event.body?.action?.display?.translationKey === "action_archived_card";
    },
    getResult(event) {
      return this.app.getCard({
        cardId: event.body?.action?.data?.card?.id,
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
