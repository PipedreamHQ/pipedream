import ditlead from "../../ditlead.app.mjs";

export default {
  props: {
    ditlead,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { id } = await this.ditlead.createWebhook({
        data: {
          url: this.http.endpoint,
          name: "Pipedream Source",
          eventId: this.getEventTypes(),
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      await this.ditlead.deleteWebhook({
        data: {
          subscriptionId: this._getWebhookId(),
        },
      });
    },
  },
  methods: {
    getEventTypes() {
      throw new Error("Event types not specified for this component");
    },
    _setWebhookId(value) {
      this.db.set("webhookId", value);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },

  },
  async run(event) {
    const { body } = event;
    const ts = Date.now();
    this.$emit(body, {
      id: ts,
      summary: "New event",
      ts,
    });
  },
};
