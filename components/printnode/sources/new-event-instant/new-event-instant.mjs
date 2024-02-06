import printnode from "../../printnode.app.mjs";

export default {
  key: "printnode-new-event-instant",
  name: "New Event Instant",
  description:
    "Emit new event when a new printnode event is created. [See the documentation](https://www.printnode.com/en/docs/api/curl)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    printnode,
    db: "$.service.db",
    http: "$.interface.http",
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of events you want to receive. If not specified, all available events will be emitted. [See the documentation for more information](https://www.printnode.com/en/docs/api/curl#webhooks).",
      optional: true,
      options: [
        "computer state",
        "print job state",
      ],
    },
  },
  methods: {
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(value) {
      this.db.set("secret", value);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(value) {
      this.db.set("webhookId", value);
    },
  },
  hooks: {
    async activate() {
      const secret = `pd-${Date.now()}`;
      this._setSecret(secret);
      const { 0: { webhookId } } = await this.printnode.createWebhook({
        data: {
          url: this.http.endpoint,
          secret,
          messages: this.eventTypes ?? [
            "*",
          ],
        },
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      await this.printnode.deleteWebhook(id);
    },
  },
  async run({ body }) {
    const ts = Date.now();
    this.$emit(body, {
      id: body.id ?? ts,
      summary: `New event ${body.id ?? body.message ?? ""}`,
      ts,
    });
  },
};
