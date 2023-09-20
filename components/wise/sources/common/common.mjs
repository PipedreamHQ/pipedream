import wise from "../../wise.app.mjs";

export default {
  props: {
    wise,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    profileId: {
      propDefinition: [
        wise,
        "profileId",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEventType() {
      throw new Error("getWebhookEventType is not implemented");
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const version = "2.0.0";
      const response = await this.wise.createWebhook({
        profileId: this.profileId,
        data: {
          name: `Pipedream - ${new Date().getTime()}`,
          trigger_on: this.getWebhookEventType(),
          delivery: {
            version,
            url: this.http.endpoint,
          },
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.wise.removeWebhook({
        profileId: this.profileId,
        webhookId,
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.emitEvent(event.body);
  },
};
