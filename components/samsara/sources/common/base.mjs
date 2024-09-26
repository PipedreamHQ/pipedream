import samsara from "../../samsara.app.mjs";

export default {
  props: {
    samsara,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the webhook. This will appear in both Samsara's cloud dashboard and the API. It can be set or updated through the Samsara Dashboard or through the API at any time.",
    },
  },
  methods: {
    getWebhookProps() {
      return {};
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    checkEvent() {
      return true;
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.samsara.createWebhook({
        data: {
          name: this.name,
          url: this.http.endpoint,
          eventTypes: this.getEventTypes(),
        },
      });
      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      return await this.samsara.deleteWebhook(hookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (this.checkEvent(body)) {
      this.$emit(body, {
        id: body.eventId,
        summary: this.getSummary(body),
        ts: body.eventTime,
      });
    }

  },
};
