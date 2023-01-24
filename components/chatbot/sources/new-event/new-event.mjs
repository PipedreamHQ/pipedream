import chatbot from "../../chatbot.app.mjs";
import { v4 as uuid } from "uuid";

export default {
  key: "chatbot-new-event",
  name: "New Event",
  description: "Emit new event for event received. *Need to be configured in the ChatBot UI flow to emit events*. [See docs here](https://www.chatbot.com/docs/webhooks/)",
  version: "0.0.2",
  type: "source",
  props: {
    chatbot,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      label: "Webhook Name",
      description: "The name of the webhook, this will be used to select in the ChatBot UI flow",
      type: "string",
      optional: true,
    },
  },
  methods: {
    async _respondWebHook(http, event) {
      http.respond({
        status: 200,
        body: event.query.challenge,
      });
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  hooks: {
    async activate() {
      const validationToken = uuid();

      const response = await this.chatbot.createWebhook({
        auth: {},
        headers: [],
        name: this.name ?? `Webhook ${validationToken}`,
        token: validationToken,
        url: this.http.endpoint,
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.chatbot.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    await this._respondWebHook(this.http, event);

    const {
      body,
      headers,
    } = event;

    this.$emit(body, {
      id: headers["x-request-id"],
      summary: `New event ${headers["x-request-id"]} received`,
      ts: new Date(),
    });
  },
};
