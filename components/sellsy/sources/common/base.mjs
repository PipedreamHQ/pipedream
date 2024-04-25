import sellsy from "../../sellsy.app.mjs";

export default {
  props: {
    sellsy,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.sellsy.createWebhook({
        data: {
          is_enabled: true,
          endpoint: this.http.endpoint,
          type: "http",
          configuration: [
            {
              id: this.getEventType(),
              is_enabled: true,
            },
          ],
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.sellsy.deleteWebhook({
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
    isRelevant() {
      return true;
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getResultItem() {
      throw new Error("getResultItem is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    const data = JSON.parse(body.notif);
    const item = await this.getResultItem(data);
    if (this.isRelevant(item)) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
