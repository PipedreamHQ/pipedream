import agrello from "../../agrello.app.mjs";

export default {
  props: {
    agrello,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("webhookId", hookId);
    },
    _getHookId() {
      return this.db.get("webhookId");
    },
  },
  hooks: {
    async activate() {
      const data = await this.agrello.createWebhook({
        data: {
          event: this.getEvent(),
          url: this.http.endpoint,
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.agrello.deleteWebhook(webhookId);
    },
  },
  async run({ body: { event } }) {
    const ts = Date.parse(new Date());
    this.$emit(event, {
      id: `${event.containerId}-${ts}`,
      summary: this.getSummary(event),
      ts: ts,
    });
  },
};
