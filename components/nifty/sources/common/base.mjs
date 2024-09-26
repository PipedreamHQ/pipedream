import nifty from "../../nifty.app.mjs";

export default {
  props: {
    nifty,
    db: "$.service.db",
    http: "$.interface.http",
    appId: {
      propDefinition: [
        nifty,
        "appId",
      ],
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("webhookId");
    },
    _setHookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.nifty.createHook({
        data: {
          app_id: this.appId,
          endpoint: this.http.endpoint,
          event: this.getEvent(),
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      await this.nifty.deleteHook({
        hookId: this._getHookId(),
        data: {
          app_id: this.appId,
        },
      });
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.data.id,
      summary: this.getSummary(body),
      ts: Date.parse(body.data.createdAt),
    });
  },
};
