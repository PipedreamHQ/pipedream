import chatforma from "../../chatforma.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "chatforma-new-user-input",
  name: "New User Input (Instant)",
  description: "Emit new event when a user provides input to the chatbot. [See the documentation](https://docs.chatforma.com/#/developers/post_subscribe_notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    chatforma,
    http: "$.interface.http",
    db: "$.service.db",
    botId: {
      propDefinition: [
        chatforma,
        "botId",
      ],
    },
    formId: {
      propDefinition: [
        chatforma,
        "formId",
        ({ botId }) => ({
          botId,
        }),
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.chatforma.createHook({
        data: {
          target_url: this.http.endpoint,
          botId: this.botId,
          formId: this.formId,
        },
      });
      this._setWebhookId(response);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.chatforma.deleteHook({
        data: {
          botId: this.botId,
          subscriptionId: webhookId,
        },
      });
    },
  },
  async run({ body }) {
    if (body.test) {
      return;
    }

    const ts = Date.parse(body.date);

    this.$emit(body, {
      id: `${body.formId}-${ts}`,
      summary: `New user input from ${body.name}`,
      ts,
    });
  },
  sampleEmit,
};
