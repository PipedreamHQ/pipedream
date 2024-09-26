import thinkific from "../../thinkific.app.mjs";

export default {
  props: {
    thinkific,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.thinkific.createWebhook({
        data: {
          target_url: this.http.endpoint,
          topic: this.getTopic(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.thinkific.deleteWebhook({
          hookId,
        });
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
    getTopic() {
      throw new Error("getTarget is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.parse(event.created_at),
      };
    },
  },
  async run({ body }) {
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
