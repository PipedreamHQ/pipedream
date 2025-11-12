import callhub from "../../callhub.app.mjs";

export default {
  key: "callhub-new-call-event-received",
  name: "New Call Event Received (Instant)",
  description: "Emit new event when a call event of the type specified is received. [See the docs](https://developer.callhub.io/reference/create-new-webhook)",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  props: {
    callhub,
    db: "$.service.db",
    http: "$.interface.http",
    eventType: {
      propDefinition: [
        callhub,
        "eventType",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.callhub.createWebhook({
        data: {
          event: this.eventType,
          target: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.callhub.deleteWebhook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "New event received",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body: { data } } = event;

    const meta = this.generateMeta(data);

    this.$emit(data, meta);
  },
};
