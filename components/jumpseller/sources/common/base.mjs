import jumpseller from "../../jumpseller.app.mjs";

export default {
  props: {
    jumpseller,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { hook } = await this.jumpseller.createWebhook({
        data: {
          hook: {
            url: this.http.endpoint,
            event: this.getEvent(),
          },
        },
      });
      this._setHookId(hook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.jumpseller.deleteWebhook({
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
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body?.order) {
      return;
    }
    const meta = this.generateMeta(body.order);
    this.$emit(body.order, meta);
  },
};
