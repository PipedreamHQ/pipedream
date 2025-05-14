import attio from "../../attio.app.mjs";

export default {
  props: {
    attio,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data: { id: { webhook_id: hookId } } } = await this.createWebhook({
        data: {
          data: {
            target_url: this.http.endpoint,
            subscriptions: this.getSubscriptions(),
          },
        },
      });
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.deleteWebhook({
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
    getSubscriptions() {
      throw new Error("getSubscriptions is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    createWebhook(args = {}) {
      return this.attio.post({
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this.attio.delete({
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
  },
  async run(event) {
    const { body: { events } } = event;
    if (!events?.length) {
      return;
    }
    events.forEach((item) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
};
