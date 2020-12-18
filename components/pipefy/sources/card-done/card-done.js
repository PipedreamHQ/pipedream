const pipefy = require("../../pipefy.app.js");

module.exports = {
  name: "Card Done (Instant)",
  key: "pipefy-card-done",
  description: "Emits an event each time a card is moved to Done a Pipe.",
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
        name: "Card Done",
        email: me.email,
        url: this.http.endpoint,
        actions: ["card.done"],
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
    const cardData = body.data;
    const cardId = cardData.card.id;
    const card = (await this.pipefy.getCard(cardId)).data.card;
    this.$emit(
      { card, cardData },
      {
        id: `${cardId}${Date.now()}`,
        summary: `${card.title} Done`,
        ts: Date.now(),
      }
    );
  },
};