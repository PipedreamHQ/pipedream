import dixa from "../../dixa.app.mjs";

export default {
  props: {
    dixa,
    http: "$.interface.http",
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "The Webhook Subscription name",
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.dixa.createWebhook({
        data: {
          name: this.name,
          url: this.http.endpoint,
          events: this.getEventType(),
          authorization: {
            _type: "NoAuth",
          },
        },
      });
      this._setHookId(response.data.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.dixa.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.now();
    this.$emit(body, {
      id: body.event_id,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
