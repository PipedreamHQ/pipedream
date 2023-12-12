import rex from "../../rex.app.mjs";

export default {
  props: {
    rex,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { result } = await this.rex.createWebhook({
        data: {
          data: {
            name: "Pipedream Webhook",
            url: this.http.endpoint,
            is_enabled: true,
            send_format_id: "v1_full_change_detail",
            events: [
              {
                event_id: this.getEvent(),
              },
            ],
          },
        },
      });
      this._setHookId(result.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.rex.deleteWebhook({
        data: {
          id: hookId,
        },
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
  async run(event) {
    const { body } = event;
    if (!body?.data?.length) {
      return;
    }
    const item = body.data[0];
    const meta = this.generateMeta(item);
    this.$emit(item, meta);
  },
};
