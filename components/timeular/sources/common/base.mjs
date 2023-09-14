import timeular from "../../timeular.app.mjs";

export default {
  dedupe: "unique",
  props: {
    timeular,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.timeular.createHook({
        data: {
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });

      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.timeular.deleteHook(id);
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
    generateMeta({ data }) {
      const { id } = data[this.getField()];

      return {
        id,
        summary: this.getSummary(id),
        ts: new Date(),
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.emitEvent(body);
  },
};
