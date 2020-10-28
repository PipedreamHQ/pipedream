const trello = require("../../trello.app.js");
const get = require("lodash.get");

module.exports = {
  key: "trello-new-list",
  name: "New List (Instant)",
  description: "Emits an event for each new list added to a board.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    db: "$.service.db",
    http: "$.interface.http",
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

    const eventType = get(body, "action.type");
    if (eventType !== "createList") {
      return;
    }

    const boardId = this.db.get("boardId");
    const listId = get(body, "action.data.list.id");
    const list = await this.trello.getList(listId);

    if (boardId && boardId !== list.idBoard) {
      return;
    }

    this.$emit(list, {
      id: list.id,
      summary: list.name,
      ts: Date.now(),
    });
  },
};
