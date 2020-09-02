const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const _ = require("lodash");

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
    this.http.respond({
      status: 200,
    });

    const body = _.get(event, "body");
    if (body) {
      const eventType = _.get(body, "action.type");
      const boardId = _.get(body, "action.data.board.id");
      let emitEvent = false;
      let board;

      if (eventType && eventType == "createBoard") {
        board = await this.trello.getBoard(boardId);
        emitEvent = true;
      }

      if (emitEvent) {
        this.$emit(board, {
          id: board.id,
          summary: board.name,
          ts: Date.now(),
        });
      }
    }
  },
};