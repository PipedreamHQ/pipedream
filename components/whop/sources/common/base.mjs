import whop from "../../whop.app.mjs";

export default {
  props: {
    whop,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(id) {
      this.db.set("hookId", id);
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.whop.createHook({
        data: {
          enabled: true,
          events: this.getEvents(),
          url: this.http.endpoint,
        },
      });

      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.whop.deleteHook(hookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.data.id,
      summary: this.getSummary(body.data),
      ts: Date.parse(body.data.created_at),
    });
  },
};
