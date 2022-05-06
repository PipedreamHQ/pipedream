import formstack from "../../formstack.app.mjs";

export default {
  props: {
    formstack,
    db: "$.service.db",
    http: "$.interface.http",
    formId: {
      propDefinition: [
        formstack,
        "formId",
      ],
    },
  },
  methods: {
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _requestIsValid(handshakeKey) {
      return this.formstack._accessToken() === handshakeKey;
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const response = await this.formstack.createWebhook({
        formId: this.formId,
        data: {
          url: this.http.endpoint,
          name: "",
        },
      });

      this._setWebhookId(response.id);
    },
    async deactivate() {
      await this.formstack.removeWebhook(this._getWebhookId());
    },
  },
  async run(event) {
    if (!this._requestIsValid(event.body.HandshakeKey)) throw new Error("HandshakeKey validator is not equal the access token");

    delete event.body.HandshakeKey;

    this.emitEvent(event);
  },
};
