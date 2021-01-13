const common = require("./common.js");

module.exports = {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  methods: {
    verifyEvent(event) {
      const { headers, body } = event;
      // verify webhook
      if (!headers || headers.token !== this.pipefy.$auth.token) {
        return false;
      }
      // check if event contains body
      if (!body || !body.data) {
        return false;
      }
      return true;
    },
  },
  hooks: {
    async activate() {
      const input = {
        pipe_id: this.pipeId,
        url: this.http.endpoint,
        actions: this.getActions(),
      };
      const response = await this.pipefy.createHook(input);
      this.db.set("hookId", response.webhook.id);
    },
    async deactivate() {
      await this.pipefy.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    if (!this.verifyEvent(event)) return;

    const cardData = event.body.data;
    const cardId = cardData.card.id;
    const card = (await this.pipefy.getCard(cardId)).data.card;
    const { body, id, summary } = this.getMeta(card, cardData);
    this.$emit(body, {
      id,
      summary,
      ts: Date.now(),
    });
  },
};