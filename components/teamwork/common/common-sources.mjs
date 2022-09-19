import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import app from "../teamwork.app.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setToken(token) {
      this.db.set("token", token);
    },
    _getToken() {
      return this.db.get("token");
    },
    _getEventName() {
      throw new Error("_getEventName() is not implemented");
    },
    _generateWebhookToken() {
      return uuidv4();
    },
    _checkHmac(body, hmac) {
      console.log("Checking HMAC...");
      const signatureKey = this._getToken();
      const expectedSignature = crypto.createHmac("sha256", signatureKey)
        .update(body, "utf8")
        .digest("hex");

      if (hmac !== expectedSignature) {
        throw new Error("Invalid HMAC Signature, connection aborted.");
      }
    },
  },
  hooks: {
    async activate() {
      console.log("Activating...");
      const token = this._generateWebhookToken();
      this._setToken(token);
      const { id } = await this.app.createWebhook(
        this._getEventName(),
        this.http.endpoint,
        token,
      );
      this._setWebhookId(id);
    },
    async deactivate() {
      console.log("Deactivating...");
      const id = this._getWebhookId();
      if (id) {
        await this.app.deleteWebhook(id);
      }
    },
  },
};

