import flodesk from "../../flodesk.app.mjs";

export default {
  props: {
    flodesk,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const response = await this.flodesk.createWebhook({
        data: {
          name: "Pipedream Webhook",
          post_url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(response?.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.flodesk.deleteWebhook({
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
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
