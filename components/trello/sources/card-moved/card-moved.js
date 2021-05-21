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
      return eventTranslationKey === "action_move_card_from_list_to_list";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      const listAfter = get(event, "body.action.data.listAfter.name");
      /** Record listAfter to use in generateMeta() */
      this.db.set("listAfter", listAfter);
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card, event }) {
      const listIdAfter = get(event, "body.action.data.listAfter.id");
      const listIdBefore = get(event, "body.action.data.listBefore.id");

      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(listIdAfter) ||
          this.lists.includes(listIdBefore))
      );
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