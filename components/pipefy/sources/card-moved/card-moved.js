const pipefy = require("../../pipefy.app.js");

module.exports = {
  name: "Card Moved (Instant)",
  key: "pipefy-card-moved",
  description: "Emits an event each time a card is moved in a Pipe.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    pipefy,
    db: "$.service.db",
    http: "$.interface.http",
    pipeId: {
      type: "integer",
      label: "Pipe ID",
      description: "ID of the Pipe, found in the URL when viewing the Pipe.",
    },
  },
  hooks: {
    async activate() {
      const me = await this.pipefy.getMe();
      const input = {
        pipe_id: this.pipeId,
        name: "Card Moved",
        email: me.email,
        url: this.http.endpoint,
        actions: ["card.move"],
      };
      const response = await this.pipefy.createHook(input);
      this.db.set("hookId", response.webhook.id);
    },
    async deactivate() {
      await this.pipefy.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    const { headers, body } = event;
    // verify webhook
    if (!headers || headers.token !== this.pipefy.$auth.token) {
      return;
    }
    // check if event contains body
    if (!body || !body.data) {
      return;
    }
    const card = body.data;
    this.$emit(card, {
      id: `${card.card.id}${Date.now()}`,
      summary: `${card.card.title} moved from ${card.from.name} to ${card.to.name}`,
      ts: Date.now(),
    });
  },
};