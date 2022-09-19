import formstack from "../../formstack.app.mjs";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

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
    _setHandshakeKey(handshakeKey) {
      this.db.set("handshakeKey", handshakeKey);
    },
    _getHandshakeKey() {
      return this.db.get("handshakeKey");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _requestIsValid(handshakeKey, key, sig, bodyRaw) {
      return (handshakeKey === this._getHandshakeKey())
        && crypto.createHmac(key, handshakeKey)
          .update(bodyRaw)
          .digest("hex") === sig;
    },
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
  },
  hooks: {
    async activate() {
      const handshakeKey = uuid();
      const response = await this.formstack.createWebhook({
        formId: this.formId,
        data: {
          url: this.http.endpoint,
          handshake_key: handshakeKey,
          content_type: "json",
          name: "",
        },
      });

      this._setHandshakeKey(handshakeKey);
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

    if (!this._requestIsValid(event.body.HandshakeKey, key, sig, event.bodyRaw)) {
      throw new Error("Event couldn't be validated from Formstack");
    }

    delete event.body.HandshakeKey;

    this.emitEvent(event);
  },
};
