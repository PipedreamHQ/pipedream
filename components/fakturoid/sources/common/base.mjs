import fakturoid from "../../fakturoid.app.mjs";

export default {
  props: {
    fakturoid,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    accountSlug: {
      propDefinition: [
        fakturoid,
        "accountSlug",
      ],
    },
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
      const response = await this.fakturoid.createWebhook({
        accountSlug: this.accountSlug,
        data: {
          events: this.getEvents(),
          webhook_url: this.http.endpoint,
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.fakturoid.deleteWebhook({
        accountSlug: this.accountSlug,
        webhookId,
      });
    },
  },
  async run({
    body, created_at: createdAt, event_name: eventName,
  }) {
    const ts = Date.parse(createdAt);
    this.$emit(body, {
      id: `${body.resource}-${ts}`,
      summary: this.getSummary({
        eventName,
        body,
      }),
      ts: ts,
    });
  },
};
