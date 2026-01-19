import elopage from "../../elopage.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "elopage-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a new webhook event is created. See the documentation by importing \"https://api.myablefy.com/api/swagger_doc/\" into the [Swagger editor](https://editor-next.swagger.io/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    elopage,
    db: "$.service.db",
    https: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook",
    },
  },
  hooks: {
    async activate() {
      const response = await this.elopage.createWebhook({
        data: {
          name: this.name,
          url: this.https.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.elopage.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New ${body.event} event`,
        ts: Date.now(),
      };
    },
  },
  async run({ body }) {
    this.https.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
  sampleEmit,
};
