import slottable from "../../slottable.app.mjs";

export default {
  props: {
    slottable,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const companyId = await this.slottable.getCompanyId();
      const { data: { id } } = await this.slottable.createWebhook({
        companyId,
        data: {
          url: this.http.endpoint,
          method: "post",
          model: this.getModel(),
          events: "changed",
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const companyId = await this.slottable.getCompanyId();
      const hookId = this._getHookId();
      if (hookId) {
        await this.slottable.deleteWebhook({
          companyId,
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
    getModel() {
      throw new Error("getModel is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body.data);
    this.$emit(body, meta);
  },
};
