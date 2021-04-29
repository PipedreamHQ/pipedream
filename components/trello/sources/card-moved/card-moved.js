const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-card-moved",
  name: "Card Moved (Instant)",
  description: "Emits an event each time a card is moved to a list.",
  version: "0.0.4",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
    lists: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({ board: c.board }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventTranslationKey = get(
        event,
        "body.action.display.translationKey"
      );
      if (eventTranslationKey !== "action_move_card_from_list_to_list")
        return false;
      return true;
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card, event }) {
      const listAfter = get(event, "body.action.data.listAfter.name");
      const listIdAfter = get(event, "body.action.data.listAfter.id");
      const listIdBefore = get(event, "body.action.data.listBefore.id");
      /** Record listAfter to use in generateMeta() */
      this.db.set("listAfter", listAfter);

      if (this.board && this.board !== card.idBoard) return false;
      if (
        this.lists &&
        this.lists.length > 0 &&
        !this.lists.includes(listIdBefore) &&
        !this.lists.includes(listIdAfter)
      )
        return false;
      return true;
    },
    generateMeta({ id, name }) {
      const listAfter = this.db.get("listAfter");
      return {
        id,
        summary: `${name} - moved to ${listAfter}`,
        ts: Date.now(),
      };
    },
  },
};