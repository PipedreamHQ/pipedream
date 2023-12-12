import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-custom-webhook-events",
  name: "Custom Webhook Events (Instant)",
  description: "Emit new events for activity matching a board, event types, lists and/or cards.",
  version: "0.0.10",
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
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        sampleEvents, sortField,
      } = await this.getSampleEvents();
      sampleEvents.sort((a, b) => (Date.parse(a[sortField]) > Date.parse(b[sortField]))
        ? 1
        : -1);
      for (const action of sampleEvents.slice(-25)) {
        this.emitEvent({
          action,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const eventTypes = this.eventTypes && this.eventTypes.length > 0
        ? this.eventTypes.join(",")
        : null;
      const actions = await this.trello.getBoardActivity(this.board, eventTypes);
      return {
        sampleEvents: actions,
        sortField: "date",
      };
    },
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
