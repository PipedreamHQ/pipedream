import common from "../common-webhook.mjs";

export default {
  ...common,
  key: "trello-custom-webhook-events",
  name: "Custom Webhook Events (Instant)",
  description: "Emit new events for activity matching a board, event types, lists and/or cards.",
  version: "0.0.6",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    eventTypes: {
      propDefinition: [
        common.props.trello,
        "eventTypes",
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
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return (
        (eventType) &&
        (!this.eventTypes ||
        this.eventTypes.length === 0 ||
        this.eventTypes.includes(eventType))
      );
    },
    async getResult(event) {
      return event.body;
    },
    async isRelevant({ result: body }) {
      let listId = body.action?.data?.list?.id;
      const cardId = body.action?.data?.card?.id;
      // If listId not returned, see if we can get it from the cardId
      if (cardId && !listId)
        listId = (await this.trello.getCardList(cardId)).id;
      return (
        (!this.lists ||
          this.lists.length === 0 ||
          !listId ||
          this.lists.includes(listId)) &&
        (!this.cards || this.cards.length === 0 || !cardId || this.cards.includes(cardId))
      );
    },
    generateMeta({ action }) {
      const {
        id,
        type: summary,
        date,
      } = action;
      return {
        id,
        summary,
        ts: Date.parse(date),
      };
    },
  },
};
