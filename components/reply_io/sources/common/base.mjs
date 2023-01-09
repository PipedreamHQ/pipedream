import reply from "../../reply_io.app.mjs";

export default {
  props: {
    reply,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.reply.createWebhook({
        data: {
          event: this.getEventType(),
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.reply.deleteWebhook(id);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    isRelevant() {
      return true;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New ${event.type}`,
        ts: Date.parse(event.date),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (this.isRelevant(body)) {
      const meta = this.generateMeta(body.event);
      this.$emit(body, meta);
    }
  },
};
