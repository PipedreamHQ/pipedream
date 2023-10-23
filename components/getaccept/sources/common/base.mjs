import getaccept from "../../getaccept.app.mjs";

export default {
  dedupe: "unique",
  props: {
    getaccept,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const [
        data,
      ] = await this.getaccept.createHook({
        data: {
          global: true,
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.getaccept.deleteHook(id);
    },
  },
  methods: {
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(body) {
      const { entity: { entity_id: id } } = body;
      return {
        id,
        summary: this.getSummary(body),
        ts: new Date(),
      };
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
