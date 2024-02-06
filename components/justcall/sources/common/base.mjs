import justcallApp from "../../justcall.app.mjs";

export default {
  props: {
    justcallApp,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.justcallApp.createHook({
        data: {
          topic_id: this.getTopicId(),
          url: this.http.endpoint,
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.justcallApp.deleteHook({
        data: {
          id,
        },
      });
    },
  },

  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run({ body }) {
    this.emitEvent(body?.data);
  },
};
