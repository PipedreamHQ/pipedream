import app from "../../trengo.app.mjs";
import CryptoJS from "crypto-js";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookId) {
      this.db.set("hookId", hookId);
    },
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _validateHash(event) {
      try {
        const signature = event?.headers["trengo-signature"];
        const [
          timestamp,
          hash,
        ] = signature.split(";");
        const raw = CryptoJS.HmacSHA256(`${timestamp}.${event.bodyRaw}`, this._getSecret());
        const hex = raw.toString(CryptoJS.enc.hex);
        const lowerCase = hex.toLowerCase();
        return lowerCase == hash;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    getEvent() {
      throw new Error("getEvent() is not implemented!");
    },
    getMeta() {
      throw new Error("getMeta() is not implemented!");
    },
    randomString() {
      return `${Math.random().toString(36)
        .substring(2, 15)}${Math.random().toString(36)
        .substring(2, 15)}`;
    },
  },
  hooks: {
    async activate() {
      const name = this.randomString();
      const resp = await this.app.createWebhook({
        data: {
          name,
          type: this.getEvent(),
          url: this.http.endpoint,
        },
      });
      this._setHookID(resp.id);
      this._setSecret(resp.signing_secret);
      console.log(`Created webhook. (Hook ID: ${resp.id}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.app.deleteWebhook({
        webhookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    if (this._validateHash(event)) {
      this.http.respond({
        status: 202,
      });
      this.$emit(
        event,
        this.getMeta(event),
      );
    } else {
      console.log(`Validation failed! Client IP(${event.client_ip})`);
    }
  },
};
