import flippingbook from "../../flippingbook.app.mjs";

export default {
  props: {
    flippingbook,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const response = await this.flippingbook.createWebhook({
        data: {
          trigger: {
            endpoint: this.http.endpoint,
            ...this.getHookParams(),
          },
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.flippingbook.deleteWebhook({
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
    getHookParams() {
      throw new Error("getHookParams is not implemented");
    },
  },
};
