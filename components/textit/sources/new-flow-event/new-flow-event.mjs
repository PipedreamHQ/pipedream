import textit from "../../textit.app.mjs";

export default {
  name: "New Flow Event",
  version: "0.0.1",
  key: "textit-new-flow-event",
  description: "Emit new event for each new flow event",
  type: "source",
  props: {
    textit,
    db: "$.service.db",
    http: "$.interface.http",
    resthookEvent: {
      propDefinition: [
        textit,
        "resthookEvent",
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
    emitEvent(event) {
      const data = event.data ?? event;

      this.$emit(data, {
        id: data.run.uuid,
        summary: `New event with id ${data.run.uuid}`,
        ts: Date.parse(data.run.created_on),
      });
    },
  },
  hooks: {
    async deploy() {
      const response = await this.textit.getResthookEvents({
        params: {
          resthook: this.resthook,
        },
      });

      response.results.reverse().forEach(this.emitEvent);
    },
    async activate() {
      const response = await this.textit.createWebhook({
        data: {
          resthook: this.resthookEvent,
          target_url: this.http.endpoint,
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.textit.removeWebhook(webhookId);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
