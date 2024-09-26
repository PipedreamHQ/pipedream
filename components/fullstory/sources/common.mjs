import app from "../fullstory.app.mjs";
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
        const signature = event?.headers["fullstory-signature"];
        const [
          ,
          orgId,
          ,
          timeStamp,
          ,
          val,
        ] = signature.split(/[:,]+/);
        const hash = CryptoJS.HmacSHA256(`${event.bodyRaw}:${orgId}:${timeStamp}`, this._getSecret());
        const hashBase64 = CryptoJS.enc.Base64.stringify(hash);
        return hashBase64 == val;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    getEvents() {
      throw new Error("getEvents() is not implemented!");
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
      const secret = this.randomString();
      this._setSecret(secret);
      const { id } = await this.app.createWebhook({
        data: {
          url: this.http.endpoint,
          eventTypes: this.getEvents(),
          secret,
        },
      });
      this._setHookID(id);
      console.log(`Created webhook. (Hook ID: ${id}, endpoint: ${this.http.endpoint})`);
    },
    async deactivate() {
      await this.app.deleteWebhook({
        hookId: this._getHookID(),
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
