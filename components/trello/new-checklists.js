const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const get = require("lodash.get");

module.exports = {
  name: "New Checklists",
  description: "Emits an event for each new checklist added to a board.",
  version: "0.0.2",
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
    this.http.respond({
      status: 200,
    });

    const body = get(event, "body");
    if (!body) {
      return;
    }

    const eventType = get(body, "action.type");
    if (eventType !== "addChecklistToCard") {
      return;
    }

    const boardId = this.db.get("boardId");
    const checklistId = get(body, "action.data.checklist.id");
    const checklist = await this.trello.getChecklist(checklistId);

    if (boardId && boardId !== checklist.idBoard) {
      return;
    }

    this.$emit(checklist, {
      id: checklist.id,
      summary: checklist.name,
      ts: Date.now(),
    });
  },
};