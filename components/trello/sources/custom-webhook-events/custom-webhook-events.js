const trello = require("../../trello.app.js");
const get = require("lodash.get");

module.exports = {
  key: "trello-custom-webhook-events",
  name: "Custom Webhook Events",
  description: "Emit events for activity matching a board, event types, lists and/or cards.",
  version: "0.0.3",
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
    // validate signature
    if (
      !this.trello.verifyTrelloWebhookRequest(
        event,
        this.http.endpoint
      )
    ) {
      return;
    }

    const body = get(event, "body");
    if (!body) {
      return;
    }
    const eventTypes = this.db.get("eventTypes");
    const listIds = this.db.get("listIds");
    const cardIds = this.db.get("cardIds");

    const eventType = get(body, "action.type");
    const listId = get(body, "action.data.list.id");
    const cardId = get(body, "action.data.card.id");

    if (eventTypes && eventTypes.length > 0 && !eventTypes.includes(eventType)) return;
    if (listIds && listIds.length > 0 && !listIds.includes(card.idList)) return;
    if (cardIds && cardIds.length > 0 && !cardIds.includes(card.id)) return;

    this.$emit(body, {
      summary: eventType,
    });
  },
};
