import chargify from "../../chargify.app.mjs";

export default {
  props: {
    chargify,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      // ensure webhooks are enabled in user's account
      await this.chargify.enableWebhooks();
    },
    async activate() {
      const { endpoint: { id } } = await this.chargify.createWebhook({
        data: {
          endpoint: {
            url: this.http.endpoint,
            webhook_subscriptions: [
              this.getEventType(),
            ],
          },
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.chargify.deleteWebhook({
          hookId,
          data: {
            endpoint: {
              url: this.http.endpoint,
              webhook_subscriptions: [],
            },
          },
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
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
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
