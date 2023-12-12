import oncehub from "../../oncehub.app.mjs";

export default {
  props: {
    oncehub,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.oncehub.createWebhook({
        data: {
          url: this.http.endpoint,
          ...this.getHookParams(),
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.oncehub.deleteWebhook(id);
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { data } } = event;
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
