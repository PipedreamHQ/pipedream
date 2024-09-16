import krispcall from "../../krispcall.app.mjs";

export default {
  props: {
    krispcall,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const data = await this.krispcall.createWebhook({
        data: {
          action: this.getAction(),
          hookUrl: this.http.endpoint,
        },
      });
      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.krispcall.deleteWebhook({
        data: {
          hookUrl: hookId,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
