import aircall from "../../aircall.app.mjs";

export default {
  props: {
    aircall,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const calls = await this.getHistoricalEvents();
      for (const call of calls.reverse()) {
        const meta = this.generateMeta(call);
        this.$emit(call, meta);
      }
    },
    async activate() {
      const { webhook } = await this.aircall.createWebhook({
        url: this.http.endpoint,
        events: [
          this.getEventType(),
        ],
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.aircall.deleteWebhook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { data } } = event;
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
