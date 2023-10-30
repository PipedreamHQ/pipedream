import app from "../../mamo_business.app.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const data = await this.app.createHook({
        data: {
          url: this.http.endpoint,
          enabled_events: this.getEvent(),
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.app.deleteHook(id);
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
      return {
        id: `${body.id}${body.created_date}`,
        summary: this.getSummary(body),
        ts: new Date(),
      };
    },
  },
  async run({ body }) {
    if (body.ping) {
      return this.http.respond({
        status: 200,
      });
    }
    this.emitEvent(body);
  },
};
