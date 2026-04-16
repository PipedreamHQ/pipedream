import common from "../common/common-webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "trello-custom-webhook-events",
  name: "Custom Webhook Events (Instant)", /* eslint-disable-line pipedream/source-name */
  description: "Emit new events for activity matching a board, event types, lists and/or cards.",
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
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      optional: true,
      description: "Only emit events for the selected event types (e.g., `updateCard`).",
      options: events,
    },
    lists: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
    },
    cards: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getSampleEvents() {
      const eventTypes = this.eventTypes?.length
        ? this.eventTypes.join(",")
        : null;
      return this.app.getBoardActivity({
        boardId: this.board,
        params: {
          filter: eventTypes,
        },
      });
    },
    getSortField() {
      return "date";
    },
    isCorrectEventType({ type }) {
      return (
        (type) &&
        (!this.eventTypes?.length ||
        this.eventTypes.includes(type))
      );
    },
    async isRelevant({ result: body }) {
      let listId = body.action?.data?.list?.id;
      const cardId = body.action?.data?.card?.id;
      // If listId not returned, see if we can get it from the cardId
      if (cardId && !listId) {
        const res = await this.app.getCardList({
          cardId,
        });
        listId = res.id;
      }
      return (
        (!this.lists?.length ||
          !listId ||
          this.lists.includes(listId)) &&
        (!this.cards?.length || !cardId || this.cards.includes(cardId))
      );
    },
    generateMeta(action) {
      const {
        id,
        type,
        date,
      } = action;
      return {
        id,
        summary: `New ${type} event`,
        ts: Date.parse(date),
      };
    },
  },
};
