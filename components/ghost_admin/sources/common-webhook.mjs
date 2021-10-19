import ghost from "../ghost-admin.app.mjs";

export default {
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const event = this.getEvent();
      const hookId = await this.ghost.createHook(event, this.http.endpoint);
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.ghost.deleteHook(hookId);
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
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
  async run(event) {
    this.emitEvent(event.body);
  },
};
