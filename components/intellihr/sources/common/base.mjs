import intellihr from "../../intellihr.app.mjs";

export default {
  props: {
    intellihr,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data } = await this.intellihr.createWebhook({
        data: {
          url: this.http.endpoint,
          webhookEvent: this.getEvent(),
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.intellihr.deleteWebhook(hookId);
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: this.getSummary(data),
        ts: Date.parse(data.timestamp),
      };
    },
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
