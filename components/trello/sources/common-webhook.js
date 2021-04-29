const common = require("./common.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const modelId = await this.getModelId();
      const { id } = await this.trello.createHook({
        id: modelId,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      await this.trello.deleteHook({ hookId });
    },
  },
  methods: {
    ...common.methods,
    async getModelId() {
      if (this.board) return this.board;
      const member = await this.trello.getMember("me");
      return member.id;
    },
    verifyEvent(event) {
      /** validate signature */
      if (!this.trello.verifyTrelloWebhookRequest(event, this.http.endpoint)) {
        return false;
      }
      const body = get(event, "body");
      return body;
    },
    isCorrectEventType(event) {
      return true;
    },
    isRelevant({ result }) {
      return true;
    },
  },
  async run(event) {
    if (!this.verifyEvent(event)) return;
    console.log("event verified");
    if (!this.isCorrectEventType(event)) return;
    console.log("is correct event type");

    const result = await this.getResult(event);
    console.log("got result");
    if (!this.isRelevant({ result, event })) return;
    console.log("event is relevant");

    this.emitEvent(result);
  },
};