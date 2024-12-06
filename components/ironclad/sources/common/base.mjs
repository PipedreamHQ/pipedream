import ironclad from "../../ironclad.app.mjs";

export default {
  props: {
    ironclad,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.ironclad.createWebhook({
        data: {
          targetURL: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.ironclad.deleteWebhook({
          webhookId,
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
    generateMeta(event) {
      return {
        id: event.timestamp,
        summary: `New ${event.payload.event} event`,
        ts: Date.parse(event.timestamp),
      };
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
