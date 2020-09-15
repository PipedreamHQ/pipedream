const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const get = require("lodash.get");

module.exports = {
  name: "Cards Archived",
  description: "Emits an event for each card archived.",
  version: "0.0.2",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    listIds: {
      propDefinition: [trello, "listIds", (c) => ({ boardId: c.boardId })],
    },
  },
  hooks: {
    async activate() {
      let modelId = this.boardId;
      if (!this.boardId) {
        const member = await this.trello.getMember("me");
        modelId = member.id;
      }
      const { id } = await this.trello.createHook({
        id: modelId,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
      this.db.set("boardId", this.boardId);
      this.db.set("listIds", this.listIds);
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

    const eventTranslationKey = get(body, "action.display.translationKey");
    if (eventTranslationKey !== "action_archived_card") {
      return;
    }

    const cardId = get(body, "action.data.card.id");
    const boardId = this.db.get("boardId");
    const listIds = this.db.get("listIds");
    const card = await this.trello.getCard(cardId);

    if (boardId && boardId !== card.idBoard) return;
    if (listIds && listIds.length > 0 && !listIds.includes(card.idList)) return;

    this.$emit(card, {
      id: card.id,
      summary: card.name,
      ts: Date.now(),
    });
  },
};