import copper from "../../copper.app.mjs";

export default {
  props: {
    copper,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.copper.createWebhook({
        data: {
          target: this.http.endpoint,
          type: this.getObjectType(),
          event: this.getEventType(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.copper.deleteWebhook({
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
    getEventType() {
      return "new";
    },
    generateMeta(item) {
      return {
        id: item.ids[0],
        summary: this.getSummary(item),
        ts: Date.parse(item.timestamp),
      };
    },
    getObjectType() {
      throw new Error("getObjectType is not implemented");
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
