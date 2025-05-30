import icontact from "../../icontact.app.mjs";

export default {
  props: {
    icontact,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
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
      const response = await this.icontact.createWebhook({
        data: [
          {
            url: this.http.endpoint,
            eventId: this.getEventType(),
          },
        ],
      });
      this._setHookId(response.webhooks[0].webhookId);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.icontact.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const data = body[0];
    this.$emit(data, this.generateMeta(data));
  },
};
