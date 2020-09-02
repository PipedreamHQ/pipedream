const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const _ = require("lodash");

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

module.exports = {
  name: "New Activity",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    eventTypes: { propDefinition: [trello, "eventTypes"] },
    listIds: {
      propDefinition: [trello, "listIds", (c) => ({ boardId: c.boardId })],
    },
    cardIds: {
      propDefinition: [trello, "cardIds", (c) => ({ boardId: c.boardId })],
    },
  },
  methods: {
    generateSecret() {
      return "" + Math.random();
    },
  },
  hooks: {
    async activate() {
      console.log(`board: ${this.boardId}`);
      const { id } = await this.trello.createHook({
        id: this.boardId,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
      this.db.set("eventTypes", this.eventTypes);
      this.db.set("listIds", this.listIds);
      this.db.set("cardIds", this.cardIds);
    },
    async deactivate() {
      console.log(this.db.get("hookId"));
      await this.trello.deleteHook({
        hookId: this.db.get("hookId"),
      });
    },
  },
  async run(event) {
    // have to be careful about where this event came from to respond
    this.http.respond({
      status: 200,
    });

    const body = _.get(event, "body");
    if (body) {
      const eventTypes = this.db.get("eventTypes");
      const listIds = this.db.get("listIds");
      const cardIds = this.db.get("cardIds");

      const eventType = _.get(body, "action.type");
      const listId = _.get(body, "action.data.list.id");
      const cardId = _.get(body, "action.data.card.id");

      let emitEvent = false;

      if (!eventTypes && !listIds && !cardIds) {
        emitEvent = true;
      } else {
        if (
          (eventType && eventTypes.includes(eventType)) ||
          (listId && listIds.includes(listId)) ||
          (cardId && cardIds.includes(cardId))
        ) {
          emitEvent = true;
        }
      }

      if (emitEvent) {
        this.$emit(body, {
          summary: eventType,
        });
      }
    }
  },
};