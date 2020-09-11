const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const get = require("lodash.get");

module.exports = {
  name: "New Boards",
  description: "Emits an event for each new board added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const member = await this.trello.getMember("me");
      const { id } = await this.trello.createHook({
        id: member.id,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
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

    const eventType = get(body, "action.type");
    if (eventType !== "createBoard") {
      return;
    }

    const boardId = get(body, "action.data.board.id");
    const board = await this.trello.getBoard(boardId);

    this.$emit(board, {
      id: board.id,
      summary: board.name,
      ts: Date.now(),
    });
  },
};