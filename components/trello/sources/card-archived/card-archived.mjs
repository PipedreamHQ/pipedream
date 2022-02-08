import common from "../common-webhook.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-card-archived",
  name: "Card Archived (Instant)",
  description: "Emit new event for each card archived.",
  version: "0.0.7",
  type: "source",
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
      const eventTranslationKey = get(
        event,
        "body.action.display.translationKey",
      );
      return eventTranslationKey === "action_archived_card";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
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
