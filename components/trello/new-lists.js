const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const _ = require("lodash");

module.exports = {
  name: "New Lists",
  description: "Emits an event for each new list added to a board.",
  version: "0.0.1",
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
    this.http.respond({
      status: 200,
    });

    const body = _.get(event, "body");
    if (body) {
      const eventType = _.get(body, "action.type");
      const boardId = this.db.get("boardId");
      let emitEvent = false;
      let list;

      if (eventType && eventType == "createList") {
        const listId = _.get(body, "action.data.list.id");
        list = await this.trello.getList(listId);
        emitEvent = true;
      }

      if (emitEvent) {
        this.$emit(list, {
          id: list.id,
          summary: list.name,
          ts: Date.now(),
        });
      }
    }
  },
};