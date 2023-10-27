import copperx from "../../copperx.app.mjs";

export default {
  dedupe: "unique",
  props: {
    copperx,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const data = await this.copperx.createHook({
        data: {
          description: "Pipedream-customer-subscription-created",
          url: this.http.endpoint,
          enabledEvents: {
            events: this.getEvent(),
          },
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.copperx.deleteHook(id);
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
    generateMeta({ id }) {
      return {
        id,
        summary: this.getSummary(id),
        ts: new Date(),
      };
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
