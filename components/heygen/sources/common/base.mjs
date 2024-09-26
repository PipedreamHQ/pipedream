import heygen from "../../heygen.app.mjs";

export default {
  props: {
    heygen,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data } = await this.heygen.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(data.endpoint_id);
    },
    async deactivate() {
      const id = this._getHookId();
      if (id) {
        await this.heygen.deleteWebhook({
          params: {
            endpoint_id: id,
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
