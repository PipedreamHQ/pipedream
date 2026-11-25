import returnista from "../../returnista.app.mjs";

export default {
  props: {
    returnista,
    db: "$.service.db",
    http: "$.interface.http",
    description: {
      type: "string",
      label: "Description",
      description: "Brief description of what the webhook is used for",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.returnista.createWebhook({
        data: {
          url: this.http.endpoint,
          eventName: this.getEvent(),
          description: this.description,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) return;

      await this.returnista.deleteWebhook({
        webhookId: hookId,
      });
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
  async run({ body }) {
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
