import belco from "../../belco.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    belco,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    shopId: {
      propDefinition: [
        belco,
        "shopId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { _id: id } = await this.belco.createWebhook({
        data: {
          shopId: this.shopId,
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.belco.deleteWebhook({
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
        id: body.requestId,
        summary: `New ${body.eventName} event received`,
        ts: Date.parse(body.date),
      };
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;

    if (!body) {
      return;
    }

    this.$emit(body, this.generateMeta(body));
  },
};
