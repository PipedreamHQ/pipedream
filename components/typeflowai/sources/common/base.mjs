import typeflowai from "../../typeflowai.app.mjs";

export default {
  props: {
    typeflowai,
    db: "$.service.db",
    http: "$.interface.http",
    workflowIds: {
      propDefinition: [
        typeflowai,
        "workflowIds",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data: { id } } = await this.typeflowai.createWebhook({
        data: {
          url: this.http.endpoint,
          triggers: this.getTriggers(),
          workflowIds: this.workflowIds,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.typeflowai.deleteWebhook({
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
    getTriggers() {
      throw new Error("getTriggers is not implemented");
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
