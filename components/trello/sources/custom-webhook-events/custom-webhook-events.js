const common = require("../common-webhook.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "trello-custom-webhook-events",
  name: "Custom Webhook Events (Instant)",
  description:
    "Emit events for activity matching a board, event types, lists and/or cards.",
  version: "0.0.4",
  props: {
    ...common.props,
    board: { propDefinition: [common.props.trello, "board"] },
    eventTypes: { propDefinition: [common.props.trello, "eventTypes"] },
    lists: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({ board: c.board }),
      ],
    },
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({ board: c.board }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return (
        !this.eventTypes ||
        this.eventTypes.length === 0 ||
        this.eventTypes.includes(eventType)
      );
    },
    async getResult(event) {
      return event.body;
    },
    isRelevant({ result: body, event }) {
      const listId = get(body, "action.data.list.id");
      const cardId = get(body, "action.data.card.id");

      return (
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(listId)) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(cardId))
      );
    },
    generateMeta({ action }) {
      const { id, type: summary, date } = action;
      return {
        id,
        summary,
        ts: Date.parse(date),
      };
    },
  },
};