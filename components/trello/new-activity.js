const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const get = require("lodash.get");

module.exports = {
  name: "New Activity (Instant)",
  version: "0.0.2",
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
    this.http.respond({
      status: 200,
    });

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