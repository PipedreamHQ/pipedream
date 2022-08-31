import formstack from "../../formstack.app.mjs";
import crypto from "crypto";

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
    _requestIsValid(handshakeKey, key, sig, bodyRaw) {
      return crypto.createHmac(key, handshakeKey)
        .update(bodyRaw)
        .digest("hex") === sig;
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
    const [
      key,
      sig,
    ] = event.headers["x-fs-signature"].split("=");

    if (!this._requestIsValid(this.formstack._accessToken(), key, sig, event.bodyRaw)) {
      throw new Error("Event couldn't be validated from Formstack");
    }

    delete event.body.HandshakeKey;

    this.emitEvent(event);
  },
};
