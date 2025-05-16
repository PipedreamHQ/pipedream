import scalr from "../../scalr.app.mjs";

export default {
  props: {
    scalr,
    db: "$.service.db",
    http: "$.interface.http",
    accountId: {
      propDefinition: [
        scalr,
        "accountId",
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
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.scalr.createWebhook({
        data: {
          "data": {
            "attributes": {
              "max-attempts": 3,
              "timeout": 15,
              "name": "Webhook Pipedream - " + new Date().toISOString(),
              "url": this.http.endpoint,
            },
            "relationships": {
              "account": {
                "data": {
                  "type": "accounts",
                  "id": this.accountId,
                },
              },
              "events": {
                "data": [
                  {
                    "type": "event-definitions",
                    "id": this.getWebhookEventType(),
                  },
                ],
              },
            },
            "type": "webhook-integrations",
          },
        },
      });
      this._setWebhookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.scalr.removeWebhook(webhookId);
    },
  },
  async run(event) {
    await this.emitEvent(event.body);
  },
};
