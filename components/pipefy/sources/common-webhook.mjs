import common from "./common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  methods: {
    verifyEvent(event) {
      const {
        headers, body,
      } = event;
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
      const { webhook } = await this.pipefy.createHook(input);
      if (webhook)
        this.db.set("hookId", webhook.id);
      else
        throw new Error("Could not create webhook. In order to create Pipefy triggers in Pipedream, you will need to be a Pipefy administrator.");
    },
    async deactivate() {
      await this.pipefy.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    if (!this.verifyEvent(event)) return;

    const cardData = event.body.data;
    const cardId = cardData.card.id;
    const card = (await this.pipefy.getCard(cardId)).card;
    const {
      body, id, summary,
    } = this.getMeta(card, cardData);
    this.$emit(body, {
      id,
      summary,
      ts: Date.now(),
    });
  },
};
