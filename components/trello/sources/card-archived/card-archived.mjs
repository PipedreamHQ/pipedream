import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-card-archived",
  name: "Card Archived (Instant)", /* eslint-disable-line pipedream/source-name */
  description: "Emit new event for each card archived.",
  version: "0.1.4",
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
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      description: "If specified, events will only be emitted when a card in one of the selected lists is archived",
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
    isCorrectEventType({ display }) {
      return display?.translationKey === "action_archived_card";
    },
    getResult({ data }) {
      return this.app.getCard({
        cardId: data?.card?.id,
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
  sampleEmit,
};
